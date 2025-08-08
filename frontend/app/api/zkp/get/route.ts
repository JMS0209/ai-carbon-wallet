import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import Database from 'better-sqlite3';
import path from 'path';
import { createHash } from 'crypto';
import fs from 'fs';

const PROVER_URL = process.env.PROVER_URL || 'https://prover.mystenlabs.com/v1';

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'data', 'zklogin.db');
// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(dbPath);

// Track ongoing requests to prevent duplicates
const ongoingRequests = new Map<string, Promise<any>>();

// Create ZK proofs cache table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS zk_proofs (
    id TEXT PRIMARY KEY,
    jwt_hash TEXT NOT NULL,
    extended_ephemeral_public_key TEXT NOT NULL,
    max_epoch TEXT NOT NULL,
    jwt_randomness TEXT NOT NULL,
    salt TEXT NOT NULL,
    key_claim_name TEXT NOT NULL,
    proof TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("ZK Proof Request Body:", JSON.stringify(body, null, 2));
    
    // Create a unique identifier for this proof request
    const proofId = createHash('sha256').update(JSON.stringify({
      jwt_hash: createHash('sha256').update(body.jwt).digest('hex'),
      extendedEphemeralPublicKey: body.extendedEphemeralPublicKey,
      maxEpoch: body.maxEpoch,
      jwtRandomness: body.jwtRandomness,
      salt: body.salt,
      keyClaimName: body.keyClaimName
    })).digest('hex');

    // Check if proof already exists in cache
    const cachedProof = db.prepare('SELECT proof FROM zk_proofs WHERE id = ?').get(proofId) as { proof: string } | undefined;
    
    if (cachedProof) {
      console.log("ZK Proof found in cache, returning cached result");
      return NextResponse.json(JSON.parse(cachedProof.proof));
    }

    // Check if the same request is already being processed
    if (ongoingRequests.has(proofId)) {
      console.log("ZK Proof request already in progress, waiting for completion...");
      try {
        const result = await ongoingRequests.get(proofId);
        return NextResponse.json(result);
      } catch (error) {
        ongoingRequests.delete(proofId);
        throw error;
      }
    }

    console.log("ZK Proof not in cache, requesting from Mysten Labs...");
    
    // Create a promise for this request and store it
    const requestPromise = (async () => {
      try {
        // Add rate limiting delay to avoid 429 errors
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Forward the request to the Mysten Labs prover service
        const response = await axios.post(PROVER_URL, body, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        });

        // Cache the successful proof
        try {
          const jwtHash = createHash('sha256').update(body.jwt).digest('hex');
          db.prepare(`
            INSERT INTO zk_proofs (
              id, jwt_hash, extended_ephemeral_public_key, max_epoch, 
              jwt_randomness, salt, key_claim_name, proof, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            proofId,
            jwtHash,
            body.extendedEphemeralPublicKey,
            body.maxEpoch,
            body.jwtRandomness,
            body.salt,
            body.keyClaimName,
            JSON.stringify(response.data),
            Date.now()
          );
          console.log("ZK Proof cached successfully");
        } catch (cacheError) {
          console.error("Failed to cache ZK proof:", cacheError);
          // Continue anyway, don't fail the request
        }

        return response.data;
      } finally {
        // Always clean up the ongoing request
        ongoingRequests.delete(proofId);
      }
    })();

    // Store the promise
    ongoingRequests.set(proofId, requestPromise);
    
    try {
      const result = await requestPromise;
      return NextResponse.json(result);
    } catch (error) {
      // Clean up on error
      ongoingRequests.delete(proofId);
      throw error;
    }

  } catch (error) {
    console.error('Error in ZKP endpoint:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data;
      console.error('ZKP Error Response:', errorData);
      
      return NextResponse.json(
        { error: errorData || 'ZK proof generation failed' },
        { status }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
