import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import {
  getMatchParams,
  getMatchQuery,
} from "@/app/features/matches/utils/server";

type MatchParams = {
  matchNumber: string;
};

export async function deleteMatchHandler(
  request: Request,
  { params }: { params: MatchParams }
) {
  try {
    const { matchNumber, tournamentId } = getMatchParams(request, params);

    if (!tournamentId) {
      return NextResponse.json(
        { error: "Tournament ID is required" },
        { status: 400 }
      );
    }

    const matchesCollection = await getCollection("matches");

    await matchesCollection.updateOne(
      getMatchQuery(matchNumber, tournamentId),
      { $set: { deletedAt: new Date() } }
    );

    return NextResponse.json({
      message: "Match removed successfully",
    });
  } catch (error) {
    console.error("Error removing match:", error);
    return NextResponse.json(
      { error: "Error removing match" },
      { status: 500 }
    );
  }
}
