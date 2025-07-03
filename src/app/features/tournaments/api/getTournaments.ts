import { getTournaments } from "../utils/server/getTournaments";
import { NextResponse } from "next/server";

export default async function getTournamentsHandler() {
  try {
    const tournaments = await getTournaments();

    return NextResponse.json(tournaments, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      { error: "Error fetching tournaments" },
      { status: 500 }
    );
  }
}
