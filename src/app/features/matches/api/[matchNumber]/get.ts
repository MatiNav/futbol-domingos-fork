import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";

export async function getMatchHandler(
  request: Request,
  { params }: { params: { matchNumber: string } }
) {
  try {
    const { matchNumber } = await params;
    const matchNum = parseInt(matchNumber);

    if (isNaN(matchNum)) {
      return NextResponse.json(
        { error: "Invalid match number" },
        { status: 400 }
      );
    }

    const collection = await getCollection("matches");

    const match = await collection.findOne({ matchNumber: matchNum });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    console.log("match", match);
    return NextResponse.json({ match });
  } catch (error) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      { error: "Error fetching match" },
      { status: 500 }
    );
  }
}
