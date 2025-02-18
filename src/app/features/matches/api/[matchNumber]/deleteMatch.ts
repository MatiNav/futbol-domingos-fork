import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import {
  getMatchParams,
  getMatchNumberQuery,
} from "@/app/features/matches/utils/server";

type MatchParams = {
  matchNumber: string;
};

export async function deleteMatchHandler(
  request: Request,
  { params }: { params: MatchParams }
) {
  const { matchNumber, tournamentId } = getMatchParams(request, params);

  const matchesCollection = await getCollection("matches");

  await matchesCollection.updateOne(
    getMatchNumberQuery(matchNumber, tournamentId),
    {
      $set: { deletedAt: new Date() },
    }
  );

  return NextResponse.json({
    message: "Match removed successfully",
  });
}
