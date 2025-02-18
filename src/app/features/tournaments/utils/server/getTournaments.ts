import { DBTournament, SerializedTournament } from "@/app/constants/types";
import { getCollection } from "@/app/utils/server/db";

export const getTournaments = async (): Promise<SerializedTournament[]> => {
  const tournamentsCollection = await getCollection("tournaments");

  const tournaments = await tournamentsCollection.find({}).toArray();

  return serializeTournaments(tournaments);
};

function serializeTournaments(
  tournaments: DBTournament[]
): SerializedTournament[] {
  return tournaments.map((tournament) => ({
    ...tournament,
    _id: tournament._id.toString(),
  }));
}
