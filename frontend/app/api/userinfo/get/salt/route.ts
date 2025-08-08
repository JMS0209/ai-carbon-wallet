import { NextRequest, NextResponse } from 'next/server';
import { SuiClient } from '@mysten/sui/client';
import Database from 'better-sqlite3';
import path from 'path';

const suiClient = new SuiClient({ 
  url: process.env.NEXT_PUBLIC_SUI_NETWORK_URL || 'https://fullnode.testnet.sui.io:443'
});

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'data', 'zklogin.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS user_salts (
    subject TEXT PRIMARY KEY,
    salt TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

// Create ZK proofs cache table
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
    const { subject, jwt } = body;

    if (!subject || !jwt) {
      return NextResponse.json(
        { status: 400, error: 'Subject and JWT are required' },
        { status: 400 }
      );
    }

    // Check if salt already exists for this subject
    const existing = db.prepare('SELECT salt FROM user_salts WHERE subject = ?').get(subject) as { salt: string } | undefined;
    
    if (existing) {
      return NextResponse.json({
        status: 200,
        salt: existing.salt
      });
    }

    // Generate new salt
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const salt = BigInt(Date.now() + Math.floor(Math.random() * 1000000));

    // Store salt in database
    db.prepare('INSERT INTO user_salts (subject, salt, created_at) VALUES (?, ?, ?)').run(
      subject,
      salt.toString(),
      Date.now()
    );

    return NextResponse.json({
      status: 200,
      salt: salt.toString()
    });

  } catch (error) {
    console.error('Error in salt endpoint:', error);
    return NextResponse.json(
      { status: 500, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
