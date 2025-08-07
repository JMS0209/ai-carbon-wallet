// AI-Carbon Wallet Backend API Server
// TODO: Implement REST and GraphQL endpoints
// TODO: Add authentication middleware
// TODO: Integrate with energy collectors
// TODO: Add Kafka producer for real-time data streaming

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY in .env');
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-08-01', // latest as of Aug 2025
});

app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'AI-Carbon Wallet Backend API',
    timestamp: new Date().toISOString()
  });
});

// STRIPE CHECKOUT SESSION
app.post('/api/checkout-session', async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 5000, // $50.00
            product_data: {
              name: 'Carbon Offset Credits',
              description: 'Purchase carbon credits to offset emissions',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

// TODO: Add zkLogin auth middleware
// TODO: Add energy data collection endpoints
// TODO: Add NFT minting trigger endpoints
// TODO: Add carbon offset automation endpoints

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
  console.log('Ready for energy collector integration');
});

export default app;
