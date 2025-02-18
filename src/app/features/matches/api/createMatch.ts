import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import { DBPlayer } from "@/app/constants/types";
import { ObjectId } from "mongodb";
import { BadRequestError } from "@/app/utils/server/errors";

type PlayerWithGoals = DBPlayer & {
  goals: number;
};

export async function createMatchHandler(request: Request) {
  const { oscuras, claras, date, tournamentId } = await request.json();

  if (!tournamentId) {
    throw new BadRequestError("Tournament ID is required");
  }

  if (!oscuras?.players?.length || !claras?.players?.length) {
    throw new BadRequestError("Both teams are required");
  }

  const matchesCollection = await getCollection("matches");

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
    _id: new ObjectId(),
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
}
