// api/auth.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { getUserByWallet } from '@/lib/db'
import { WALRUS_SECRET_KEY } from '@/config/env'

const JWT_EXPIRY = '2h'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { walletAddress, signature } = req.body

  if (!walletAddress || !signature) {
    return res.status(400).json({ error: 'Missing wallet or signature' })
  }

  try {
    // Optional: verify signature matches wallet
    // You can use ethers.js or viem here
    // const isValid = verifySignature(walletAddress, signature)
    // if (!isValid) throw new Error('Invalid signature')

    const user = await getUserByWallet(walletAddress)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const token = jwt.sign(
      {
        sub: user.id,
        wallet: walletAddress,
        role: user.role, // e.g. 'admin', 'contributor', 'viewer'
      },
      WALRUS_SECRET_KEY,
      { expiresIn: JWT_EXPIRY }
    )

    return res.status(200).json({ token })
  } catch (err) {
    console.error('Auth error:', err)
    return res.status(500).json({ error: 'Authentication failed' })
  }
}