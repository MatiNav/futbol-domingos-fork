import { EditTeams } from "@/app/features/matches/components/teams";
import { getLatestMatchNumber } from "@/app/features/matches/utils/server";
import {
  getPlayers,
  getPlayersWithStats,
} from "@/app/features/players/utils/server";

export const dynamic = "force-dynamic";

export default async function EditTeamsPage() {
  const [maxMatchNumber, players, playersWithStats] = await Promise.all([
    getLatestMatchNumber(),
    getPlayers(),
    getPlayersWithStats(),
  ]);

  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }

  return (
    <EditTeams
      maxMatchNumber={maxMatchNumber}
      players={players.data.players}
      playersMap={players.data.playersMap}
      playersWithStats={playersWithStats}
    />
  );
}
