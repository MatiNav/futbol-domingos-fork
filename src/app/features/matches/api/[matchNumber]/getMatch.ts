import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import {
  getMatchParams,
  getMatchNumberQuery,
  serializeMatch,
} from "../../utils/server";
import { NotFoundError } from "@/app/utils/server/errors";
import { RouteHandlerContext } from "@/app/utils/server/withErrorHandler";

export async function getMatchHandler(
  request: NextRequest,
  context: RouteHandlerContext
) {
  const { matchNumber, tournamentId } = getMatchParams(request, context);

  const collection = await getCollection("matches");

  const query = getMatchNumberQuery(matchNumber, tournamentId);
  const match = await collection.findOne(query);

  if (!match) {
    throw new NotFoundError("Match not found");
  }

  const serializedMatch = serializeMatch(match);

  return NextResponse.json({ match: serializedMatch });
}
