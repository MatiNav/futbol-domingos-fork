import { getPlayers } from "@/app/features/players/utils/server";
import { NextResponse } from "next/server";

export async function getPlayersHandler() {
  try {
    const playersResponse = await getPlayers();

    if ("error" in playersResponse) {
      return NextResponse.json(
        { error: playersResponse.error },
        { status: playersResponse.status }
      );
    }

    return NextResponse.json({ players: playersResponse.data.players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Error fetching players" },
      { status: 500 }
    );
  }
}
