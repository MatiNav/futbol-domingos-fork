import { getTournaments } from "@/app/features/tournaments/utils/server";

export async function getTournamentIdFromParams({
  tournamentId,
}: {
  tournamentId?: string;
}) {
  if (!tournamentId) {
    const tournaments = await getTournaments();
    tournamentId = tournaments[0]._id;
  }

  return tournamentId;
}
