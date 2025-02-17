import { SetUpTeams } from "@/app/features/matches/components/teams";
import { getPlayers } from "@/app/features/players/utils/server";

export default async function SetUpTeamsPage() {
  const players = await getPlayers();

  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }

  return <SetUpTeams players={players.data} />;
}
