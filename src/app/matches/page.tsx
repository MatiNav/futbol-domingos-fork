import { getSession } from "@auth0/nextjs-auth0";
import Matches from "../features/matches/components/Matches";
import { UserProfileWithPlayerId } from "../constants/types";
import { getPlayers } from "@/app/features/players/utils/server";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  const players = await getPlayers();

  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }

  return <Matches players={players.data} user={user} />;
}
