import { getPlayersWithStats } from "@/app/features/players/utils/server";
import { NextRequest, NextResponse } from "next/server";

export async function getPlayersWithStatsHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentIdParam = searchParams.get("tournamentId");
    const matchNumberParam = searchParams.get("matchNumber");

    if (!tournamentIdParam) {
      return NextResponse.json(
        { error: "Tournament ID is required" },
        { status: 400 }
      );
    }

    const matchNumber =
      matchNumberParam === null ? undefined : parseInt(matchNumberParam);

    const playersWithStats = await getPlayersWithStats(
      tournamentIdParam,
      matchNumber
    );

    if ("error" in playersWithStats) {
      return NextResponse.json({ error: playersWithStats.error });
    }

    return NextResponse.json(playersWithStats);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Error fetching players" },
      { status: 500 }
    );
  }
}
