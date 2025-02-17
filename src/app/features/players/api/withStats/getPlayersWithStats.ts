import { getPlayersWithStats } from "@/app/features/players/utils/server";
import { NextResponse } from "next/server";

export async function getPlayersWithStatsHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchNumberParam = searchParams.get("matchNumber");

    const matchNumber =
      matchNumberParam === null ? undefined : parseInt(matchNumberParam);

    const playersWithStats = await getPlayersWithStats(matchNumber);

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
