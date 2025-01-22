import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

interface Player {
  name: string;
  goals: number;
}

export async function GET(
  request: Request,
  { params }: { params: { matchNumber: string } }
) {
  try {
    const matchNumber = parseInt(params.matchNumber);

    if (isNaN(matchNumber)) {
      return NextResponse.json(
        { error: 'Invalid match number' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('futbol');
    const collection = db.collection('matches');

    const match = await collection.findOne({ matchNumber });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { error: 'Error fetching match' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { matchNumber: string } }
) {
  try {
    const matchNumber = parseInt(params.matchNumber);
    const { oscuras, claras } = await request.json();

    if (isNaN(matchNumber)) {
      return NextResponse.json(
        { error: 'Invalid match number' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('futbol');
    const matchesCollection = db.collection('matches');
    const playersCollection = db.collection('players');

    // Get the original match
    const originalMatch = await matchesCollection.findOne({ matchNumber });

    if (!originalMatch) {
      return NextResponse.json(
        { error: 'Original match not found' },
        { status: 404 }
      );
    }

    // Calculate goals for original match
    const originalOscurasGoals = originalMatch.oscuras.reduce((sum: number, player: Player) => sum + (player.goals || 0), 0);
    const originalClarasGoals = originalMatch.claras.reduce((sum: number, player: Player) => sum + (player.goals || 0), 0);

    // Calculate goals for new match state
    const oscurasGoals = oscuras.reduce((sum: number, player: Player) => sum + (player.goals || 0), 0);
    const clarasGoals = claras.reduce((sum: number, player: Player) => sum + (player.goals || 0), 0);

    // First, remove old statistics
    for (const player of [...originalMatch.oscuras, ...originalMatch.claras]) {
      const isOriginalOscuras = originalMatch.oscuras.some((p: Player) => p.name === player.name);
      const updateQuery = {
        $inc: {
          goals: -player.goals,
          wins: originalOscurasGoals > originalClarasGoals ? (isOriginalOscuras ? -1 : 0) : (isOriginalOscuras ? 0 : -1),
          losses: originalOscurasGoals < originalClarasGoals ? (isOriginalOscuras ? -1 : 0) : (isOriginalOscuras ? 0 : -1),
          draws: originalOscurasGoals === originalClarasGoals ? -1 : 0
        }
      };

      await playersCollection.updateOne(
        { name: player.name },
        updateQuery,
        { upsert: true }
      );
    }

    // Then, add new statistics
    for (const player of [...oscuras, ...claras]) {
      const isOscuras = oscuras.some((p: Player) => p.name === player.name);
      const updateQuery = {
        $inc: {
          goals: player.goals,
          wins: oscurasGoals > clarasGoals ? (isOscuras ? 1 : 0) : (isOscuras ? 0 : 1),
          losses: oscurasGoals < clarasGoals ? (isOscuras ? 1 : 0) : (isOscuras ? 0 : 1),
          draws: oscurasGoals === clarasGoals ? 1 : 0
        }
      };

      await playersCollection.updateOne(
        { name: player.name },
        updateQuery,
        { upsert: true }
      );
    }

    // Update the match itself
    await matchesCollection.updateOne(
      { matchNumber },
      { $set: { oscuras, claras } }
    );

    return NextResponse.json({ 
      message: 'Match and player statistics updated successfully' 
    });

  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Error updating match' },
      { status: 500 }
    );
  }
} 