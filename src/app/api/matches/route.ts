import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DBPlayer } from "@/app/constants/types/db-models/Player";
import { ObjectId } from "mongodb";

type PlayerWithGoals = DBPlayer & {
  goals: number;
};

export async function POST(request: Request) {
  try {
    const { oscuras, claras, date } = await request.json();

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
      .find({})
      .sort({ matchNumber: -1 })
      .limit(1)
      .toArray();

    const nextMatchNumber =
      lastMatch.length > 0 ? lastMatch[0].matchNumber + 1 : 1;

    console.log(JSON.stringify(oscuras, null, 2));
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

    console.log(oscurasDoc, clarasDoc);

    const result = await matchesCollection.insertOne({
      oscuras: oscurasDoc,
      claras: clarasDoc,
      date,
      matchNumber: nextMatchNumber,
      createdAt: new Date(),
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
