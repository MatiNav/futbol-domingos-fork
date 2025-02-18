import { SetUpTeams } from "@/app/features/matches/components/teams";
import { getPlayersWithStats } from "@/app/features/players/utils/server";

export default async function SetUpTeamsPage({
  searchParams,
}: {
  searchParams: { tournamentId: string };
}) {
  const playersWithStats = await getPlayersWithStats(searchParams.tournamentId);

  return <SetUpTeams playersWithStats={playersWithStats} />;
}
