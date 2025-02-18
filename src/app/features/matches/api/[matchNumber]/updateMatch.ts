import { NextResponse } from "next/server";
import { MatchPlayer, MatchResult, Team } from "@/app/constants/types";
import { getCollection } from "@/app/utils/server/db";
import { getMatchQuery } from "@/app/features/matches/utils/server";

export async function updateMatchHandler(
  request: Request,
  { params }: { params: { matchNumber: string } }
) {
  try {
    const matchesCollection = await getCollection("matches");

    const { matchNumber, oscuras, claras, tournamentId } =
      await getMatchParamsFromJson(request, params);

    const result = getMatchResult(oscuras, claras);

    await matchesCollection.updateOne(
      getMatchQuery(matchNumber, tournamentId),
      { $set: { oscuras, claras, winner: result.winner } }
    );

    return NextResponse.json({
      message: "Match and player statistics updated successfully",
    });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json(
      { error: "Error updating match" },
      { status: 500 }
    );
  }
}

async function getMatchParamsFromJson(
  request: Request,
  params: { matchNumber: string }
) {
  const matchNumber = parseInt(params.matchNumber);
  const { oscuras, claras, tournamentId } = await request.json();

  if (isNaN(matchNumber)) {
    throw new Error("Invalid match number");
  }

  if (!tournamentId) {
    throw new Error("Tournament ID is required");
  }

  return { matchNumber, oscuras, claras, tournamentId };
}

function getMatchResult(
  oscuras: Team,
  claras: Team
): {
  winner?: MatchResult;
  played: boolean;
} {
  const oscurasGoals = oscuras.players.reduce(
    (acc: number, player: MatchPlayer) => acc + player.goals,
    0
  );
  const clarasGoals = claras.players.reduce(
    (acc: number, player: MatchPlayer) => acc + player.goals,
    0
  );

  if (oscurasGoals === 0 && clarasGoals === 0) {
    return {
      played: false,
    };
  }

  const winner =
    oscurasGoals > clarasGoals
      ? MatchResult.OSCURAS
      : oscurasGoals < clarasGoals
      ? MatchResult.CLARAS
      : MatchResult.DRAW;

  return {
    winner,
    played: true,
  };
}
