import { getSession } from "@auth0/nextjs-auth0";
import Matches from "../components/Matches";
import { UserProfileWithPlayerId } from "../constants/types";
import { getLatestMatchNumber } from "../utils/server/matches";
import { getPlayers } from "../utils/server/players";

export default async function MatchesPage() {
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  const maxMatchNumber = await getLatestMatchNumber();
  const players = await getPlayers();
  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }
  return (
    <Matches
      maxMatchNumber={maxMatchNumber}
      players={players.data}
      user={user}
    />
  );
}
