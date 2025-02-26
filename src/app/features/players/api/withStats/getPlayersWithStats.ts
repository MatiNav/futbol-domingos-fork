import { getPlayersWithStats } from "@/app/features/players/utils/server";
import { BadRequestError } from "@/app/utils/server/errors";
import { NextRequest, NextResponse } from "next/server";

export async function getPlayersWithStatsHandler(request: NextRequest) {
  const { tournamentIdParam, matchNumber } = getParams(request);

  const playersWithStats = await getPlayersWithStats(
    tournamentIdParam,
    matchNumber
  );

  return NextResponse.json(playersWithStats);
}

function getParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tournamentIdParam = getTournamentIdFromParams(searchParams);
  const matchNumber = getMatchNumberFromParams(searchParams);
  return { tournamentIdParam, matchNumber };
}

function getTournamentIdFromParams(searchParams: URLSearchParams) {
  const tournamentIdParam = searchParams.get("tournamentId");
  if (!tournamentIdParam) {
    throw new BadRequestError("Missing tournamentId");
  }
  return tournamentIdParam;
}

function getMatchNumberFromParams(searchParams: URLSearchParams) {
  const matchNumberParam = searchParams.get("matchNumber");
  if (!matchNumberParam) {
    throw new BadRequestError("Missing matchNumber");
  }

  const matchNumber = parseInt(matchNumberParam);
  if (isNaN(matchNumber)) {
    throw new BadRequestError("matchNumber must be a number");
  }
  return matchNumber;
}
