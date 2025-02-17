import { DBMatch, SerializedMatch } from "@/app/constants/types/Match";
import { getCollection } from "@/app/utils/server/db";

export async function getLatestMatchNumber() {
  const collection = await getCollection("matches");

  const lastMatch = await collection
    .find({
      deletedAt: { $exists: false },
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
