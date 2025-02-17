import { SetUpTeams } from "@/app/features/matches/components/teams";
import { getPlayersWithStats } from "@/app/features/players/utils/server";

export default async function SetUpTeamsPage() {
  const playersWithStats = await getPlayersWithStats();

  return <SetUpTeams playersWithStats={playersWithStats} />;
}
