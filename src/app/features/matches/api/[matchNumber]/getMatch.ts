import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import { DBMatch } from "@/app/constants/types";

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

function serializeMatch(match: DBMatch) {
  return {
    ...match,
    oscuras: {
      ...match.oscuras,
      players: match.oscuras.players.map((player) => ({
        ...player,
        _id: player._id.toString(),
      })),
    },
    claras: {
      ...match.claras,
      players: match.claras.players.map((player) => ({
        ...player,
        _id: player._id.toString(),
      })),
    },
  };
}
