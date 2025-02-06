import Matches from "../components/Matches";
import { getLatestMatchNumber } from "../utils/server/matches";
import { getPlayers } from "../utils/server/players";
export default async function MatchesPage() {
  const maxMatchNumber = await getLatestMatchNumber();
  const players = await getPlayers();
  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }
  return <Matches maxMatchNumber={maxMatchNumber} players={players.data} />;
}
