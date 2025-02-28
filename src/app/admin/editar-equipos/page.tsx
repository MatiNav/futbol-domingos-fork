import { EditTeams } from "@/app/features/matches/components/teams";
import { getPlayers } from "@/app/features/players/utils/server";

export const dynamic = "force-dynamic";

export default async function EditTeamsPage() {
  const players = await getPlayers();

  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }

  return <EditTeams />;
}
