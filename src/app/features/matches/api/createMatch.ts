import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DBPlayer } from "@/app/constants/types";
import { ObjectId } from "mongodb";

type PlayerWithGoals = DBPlayer & {
  goals: number;
};

export async function createMatchHandler(request: Request) {
  try {
    const { oscuras, claras, date, tournamentId } = await request.json();

    if (!tournamentId) {
      return NextResponse.json(
        { error: "Tournament ID is required" },
        { status: 400 }
      );
    }

    if (!oscuras?.players?.length || !claras?.players?.length) {
      return NextResponse.json(
        { error: "Both teams are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("futbol");
    const matchesCollection = db.collection("matches");

    // Get the last match to determine the next match number
    const lastMatch = await matchesCollection
      .find({
        tournamentId: new ObjectId(String(tournamentId)),
        deletedAt: { $exists: false },
      })
      .sort({ matchNumber: -1 })
      .limit(1)
      .toArray();

    const nextMatchNumber =
      lastMatch.length > 0 ? lastMatch[0].matchNumber + 1 : 1;

    const oscurasDoc = {
      team: oscuras.team,
      players: oscuras.players.map((player: PlayerWithGoals) => ({
        _id: new ObjectId(player._id),
        goals: player.goals,
      })),
    };

    const clarasDoc = {
      team: claras.team,
      players: claras.players.map((player: PlayerWithGoals) => ({
        _id: new ObjectId(player._id),
        goals: player.goals,
      })),
    };

    const result = await matchesCollection.insertOne({
      oscuras: oscurasDoc,
      claras: clarasDoc,
      date,
      matchNumber: nextMatchNumber,
      createdAt: new Date(),
      tournamentId: new ObjectId(String(tournamentId)),
    });

    return NextResponse.json({
      message: "Partido creado exitosamente",
      matchId: result.insertedId,
      matchNumber: nextMatchNumber,
    });
  } catch (error) {
    console.error("Error creando partido:", error);
    return NextResponse.json(
      { error: "Error creando partido" },
      { status: 500 }
    );
  }
}
