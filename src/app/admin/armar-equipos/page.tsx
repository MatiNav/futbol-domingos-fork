import { SetUpTeams } from "@/app/features/matches/components/teams";
import { getPlayersWithStats } from "@/app/features/players/utils/server";
import { getTournamentIdFromParams } from "@/app/utils/url";

export default async function SetUpTeamsPage({
  searchParams,
}: {
  searchParams: { tournamentId: string };
}) {
  const tournamentId = await getTournamentIdFromParams(searchParams);
  const playersWithStats = await getPlayersWithStats(tournamentId);

  return <SetUpTeams playersWithStats={playersWithStats} />;
}
