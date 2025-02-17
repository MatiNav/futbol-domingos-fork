import { NextResponse } from "next/server";
import { DBPlayer } from "@/app/constants/types";
import { ObjectId } from "mongodb";
import { getCollection } from "@/app/utils/server/db";

export const dynamic = "force-dynamic";

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

    const matchesCollection = await getCollection("matches");

    // Get the last match to determine the next match number
    const lastMatch = await matchesCollection
      .find({})
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
      _id: new ObjectId(),
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
