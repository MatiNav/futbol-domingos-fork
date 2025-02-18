import { NextResponse } from "next/server";
import { getLatestMatchNumber } from "../utils/server";

export async function getLatestMatchNumberHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get("tournamentId");

    if (!tournamentId) {
      return NextResponse.json(
        { error: "Tournament ID is required" },
        { status: 400 }
      );
    }

    const maxMatchNumber = await getLatestMatchNumber(tournamentId);

    return NextResponse.json({ maxMatchNumber });
  } catch (error) {
    console.error("Error fetching max match number:", error);
    return NextResponse.json(
      { error: "Error fetching max match number" },
      { status: 500 }
    );
  }
}
