import { NextResponse, NextRequest } from "next/server";
import { MatchPlayer, MatchResult, Team } from "@/app/constants/types";
import { getCollection } from "@/app/utils/server/db";
import {
  getMatchNumberFromContext,
  getMatchNumberQuery,
} from "@/app/features/matches/utils/server";
import { RouteHandlerContext } from "@/app/utils/server/withErrorHandler";

export async function updateMatchHandler(
  request: NextRequest,
  context: RouteHandlerContext
) {
  const matchesCollection = await getCollection("matches");

  const { matchNumber, oscuras, claras, tournamentId } =
    await getMatchParamsFromJson(request, context);

  const result = getMatchResult(oscuras, claras);

  await matchesCollection.updateOne(
    getMatchNumberQuery(matchNumber, tournamentId),
    { $set: { oscuras, claras, winner: result.winner } }
  );

  return NextResponse.json({
    message: "Match and player statistics updated successfully",
  });
}

async function getMatchParamsFromJson(
  request: NextRequest,
  context: RouteHandlerContext
) {
  const matchNumber = getMatchNumberFromContext(context);

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
