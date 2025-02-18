import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import {
  getMatchParams,
  getMatchNumberQuery,
  serializeMatch,
} from "../../utils/server";
import { NotFoundError } from "@/app/utils/server/errors";

export async function getMatchHandler(
  request: Request,
  { params }: { params: { matchNumber: string } }
) {
  const { matchNumber, tournamentId } = getMatchParams(request, params);

  const collection = await getCollection("matches");

  const query = getMatchNumberQuery(matchNumber, tournamentId);
  console.log(query, "query");
  const match = await collection.findOne(query);

  console.log(match, "match");
  if (!match) {
    throw new NotFoundError("Match not found");
  }

  const serializedMatch = serializeMatch(match);

  return NextResponse.json({ match: serializedMatch });
}
