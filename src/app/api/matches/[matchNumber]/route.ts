import { NextResponse } from "next/server";
import { MatchPlayer, MatchResult, Team } from "@/app/constants/types";
import { getCollection } from "@/app/utils/server/db";

export const dynamic = "force-dynamic";

export async function GET(
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

    return NextResponse.json({ match });
  } catch (error) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      { error: "Error fetching match" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { matchNumber: string } }
) {
  try {
    const matchNumber = parseInt(params.matchNumber);
    const { oscuras, claras } = await request.json();

    if (isNaN(matchNumber)) {
      return NextResponse.json(
        { error: "Invalid match number" },
        { status: 400 }
      );
    }

    const matchesCollection = await getCollection("matches");

    const result = getMatchResult(oscuras, claras);

    await matchesCollection.updateOne(
      { matchNumber },
      { $set: { oscuras, claras, winner: result.winner } }
    );

    return NextResponse.json({
      message: "Match and player statistics updated successfully",
    });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json(
      { error: "Error updating match" },
      { status: 500 }
    );
  }
}

function getMatchResult(
  oscuras: Team,
  claras: Team
): {
  winner?: MatchResult;
  played: boolean;
} {
  const oscurasGoals = oscuras.players.reduce(
    (acc: number, player: MatchPlayer) => acc + player.goals,
    0
  );
  const clarasGoals = claras.players.reduce(
    (acc: number, player: MatchPlayer) => acc + player.goals,
    0
  );

  if (oscurasGoals === 0 && clarasGoals === 0) {
    return {
      played: false,
    };
  }

  const winner =
    oscurasGoals > clarasGoals
      ? MatchResult.OSCURAS
      : oscurasGoals < clarasGoals
      ? MatchResult.CLARAS
      : MatchResult.DRAW;

  return {
    winner,
    played: true,
  };
}
