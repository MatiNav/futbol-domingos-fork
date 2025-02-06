import { getCollection } from "./db";

export async function getLatestMatchNumber() {
  const collection = await getCollection("matches");

  const lastMatch = await collection
    .find({})
    .sort({ matchNumber: -1 })
    .limit(1)
    .toArray();

  const maxMatchNumber = lastMatch.length > 0 ? lastMatch[0].matchNumber : 1;
  return maxMatchNumber;
}
