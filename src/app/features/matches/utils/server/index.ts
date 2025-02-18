import { DBMatch, SerializedMatch } from "@/app/constants/types/Match";
import { getCollection } from "@/app/utils/server/db";
import { ObjectId } from "mongodb";

export function getMatchParams(
  request: Request,
  params: { matchNumber: string }
) {
  const { matchNumber } = params;
  const matchNum = parseInt(matchNumber);
  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get("tournamentId");

  if (!tournamentId) {
    throw new Error("Tournament ID is required");
  }

  return { matchNumber: matchNum, tournamentId };
}

export function getMatchQuery(
  matchNumber: number,
  tournamentId: string,
  deleted = false
) {
  if (!tournamentId || typeof tournamentId !== "string") {
    throw new Error("Tournament ID is required and must be a string");
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
