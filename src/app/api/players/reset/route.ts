import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('futbol');
    const playersCollection = db.collection('players');

    await playersCollection.updateMany(
      {},
      {
        $set: {
          goals: 0,
          wins: 0,
          draws: 0,
          losses: 0
        }
      }
    );

    return NextResponse.json({ 
      message: 'Player statistics reset successfully' 
    });

  } catch (error) {
    console.error('Error resetting player statistics:', error);
    return NextResponse.json(
      { error: 'Error resetting player statistics' },
      { status: 500 }
    );
  }
} 