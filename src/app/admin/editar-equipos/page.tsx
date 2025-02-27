import { EditTeams } from "@/app/features/matches/components/teams";
import {
  getPlayers,
  getPlayersWithStats,
} from "@/app/features/players/utils/server";

export const dynamic = "force-dynamic";

export default async function EditTeamsPage({
  searchParams,
}: {
  searchParams: { tournamentId: string };
}) {
  const [players, playersWithStats] = await Promise.all([
    getPlayers(),
    getPlayersWithStats(searchParams.tournamentId),
  ]);

  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }

  return (
    <EditTeams
      players={players.data.players}
      playersMap={players.data.playersMap}
      playersWithStats={playersWithStats}
    />
  );
}
