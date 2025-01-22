import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { oscuras, claras, date } = await request.json();

    if (!oscuras?.length || !claras?.length) {
      return NextResponse.json(
        { error: 'Both teams are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('futbol');
    const matchesCollection = db.collection('matches');

    // Get the last match to determine the next match number
    const lastMatch = await matchesCollection
      .find({})
      .sort({ matchNumber: -1 })
      .limit(1)
      .toArray();

    const nextMatchNumber = lastMatch.length > 0 ? lastMatch[0].matchNumber + 1 : 1;

    const result = await matchesCollection.insertOne({
      oscuras,
      claras,
      date,
      matchNumber: nextMatchNumber,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      message: 'Match created successfully',
      matchId: result.insertedId,
      matchNumber: nextMatchNumber
    });

  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Error creating match' },
      { status: 500 }
    );
  }
} 