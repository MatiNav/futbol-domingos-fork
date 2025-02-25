import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import {
  getMatchParams,
  getMatchNumberQuery,
} from "@/app/features/matches/utils/server";
import { RouteHandlerContext } from "@/app/utils/server/withErrorHandler";

export async function deleteMatchHandler(
  request: NextRequest,
  context: RouteHandlerContext
) {
  const { matchNumber, tournamentId } = getMatchParams(request, context);

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
