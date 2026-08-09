// test-mongo.js

// 1. Load .env first (at the very top)
import dotenv from 'dotenv';
dotenv.config();

// 2. Import your connectDB
import connectDB from './src/utils/connectDB.js';

async function test() {
  console.log('Connecting to MongoDB…');
  await connectDB();
  console.log('✅ Connected to MongoDB');
}

test().catch(console.error);
