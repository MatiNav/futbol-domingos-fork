import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import {
  getMatchParams,
  getMatchQuery,
  serializeMatch,
} from "../../utils/server";
export async function getMatchHandler(
  request: Request,
  { params }: { params: { matchNumber: string } }
) {
  try {
    const { matchNumber, tournamentId } = getMatchParams(request, params);

    if (isNaN(matchNumber)) {
      return NextResponse.json(
        { error: "Invalid match number" },
        { status: 400 }
      );
    }

    const collection = await getCollection("matches");

    const match = await collection.findOne(
      getMatchQuery(matchNumber, tournamentId)
    );

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const serializedMatch = serializeMatch(match);

    return NextResponse.json({ match: serializedMatch });
  } catch (error) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      { error: "Error fetching match" },
      { status: 500 }
    );
  }
}
