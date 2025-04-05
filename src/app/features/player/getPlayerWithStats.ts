import { NextResponse } from "next/server";
import { getPlayersWithStats } from "@/app/features/players/utils/server";
import { getTournaments } from "@/app/features/tournaments/utils/server";

export async function getPlayerStatsHandler(
  request: Request,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const playerName = context.params.playerName as string;

    const tournamentsResponse = await getTournaments();
    const playerStats = [];
    let player = null;

    for (const tournament of tournamentsResponse) {
      const playersWithStatsResponse = await getPlayersWithStats(
        tournament._id
      );

      const playerInTournament = playersWithStatsResponse.find(
        (player) => player.name.toLowerCase() === playerName.toLowerCase()
      );

      if (playerInTournament) {
        const { name, favoriteTeam, image } = playerInTournament;

        player = { name, favoriteTeam, image };

        playerStats.push({
          tournament: tournament.name,
          stats: playerInTournament,
        });
      }
    }

    if (playerStats.length === 0) {
      return NextResponse.json(
        { error: "Player with stats not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      playerProfile: {
        player,
        tournaments: playerStats,
      },
    });
  } catch (error) {
    console.error("Error fetching player profile:", error);
    return NextResponse.json(
      { error: "Error fetching player profile" },
      { status: 500 }
    );
  }
}
