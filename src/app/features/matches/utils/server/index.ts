import { BadRequestError } from "@/app/utils/server/errors";
import { DBMatch, SerializedMatch } from "@/app/constants/types/Match";
import { getCollection } from "@/app/utils/server/db";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { RouteHandlerContext } from "@/app/utils/server/withErrorHandler";

export function getMatchNumberFromContext(context: RouteHandlerContext) {
  if (
    context.params.matchNumber == null ||
    typeof context.params.matchNumber !== "string"
  ) {
    throw new BadRequestError(
      "Missing matchNumber in params or is not a string"
    );
  }

  return parseInt(context.params.matchNumber);
}

export function getMatchParams(
  request: NextRequest,
  context: RouteHandlerContext
) {
  const matchNumber = getMatchNumberFromContext(context);

  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get("tournamentId");

  if (isNaN(matchNumber)) {
    throw new BadRequestError("Match number is required and must be a number");
  }

  if (!tournamentId) {
    throw new BadRequestError("Tournament ID is required");
  }

  return { matchNumber, tournamentId };
}

export function getMatchNumberQuery(
  matchNumber: number,
  tournamentId: string,
  deleted = false
) {
  if (!tournamentId || typeof tournamentId !== "string") {
    throw new BadRequestError("Tournament ID is required and must be a string");
  }

  return {
    matchNumber,
    deletedAt: { $exists: deleted },
    tournamentId: new ObjectId(tournamentId),
  };
}

export async function getLatestMatchNumber(tournamentId: string) {
  const collection = await getCollection("matches");

  const lastMatch = await collection
    .find({
      deletedAt: { $exists: false },
      tournamentId: new ObjectId(tournamentId),
    })
    .sort({ matchNumber: -1 })
    .limit(1)
    .toArray();

  const maxMatchNumber = lastMatch.length > 0 ? lastMatch[0].matchNumber : 1;
  return maxMatchNumber;
}

export function serializeMatch(match: DBMatch): SerializedMatch {
  return {
    ...match,
    _id: match._id.toString(),
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
