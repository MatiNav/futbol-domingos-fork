import { getSession } from "@auth0/nextjs-auth0";
import Matches from "../features/matches/components/Matches";
import { UserProfileWithPlayerId } from "../constants/types";
import { getLatestMatchNumber } from "@/app/features/matches/utils/server";
import {
  getPlayers,
  getPlayersWithStats,
} from "@/app/features/players/utils/server";
import { ParsedUrlQuery } from "querystring";
import { getTournamentIdFromParams } from "@/app/utils/url";

export const dynamic = "force-dynamic";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: ParsedUrlQuery;
}) {
  const tournamentId = await getTournamentIdFromParams(searchParams);
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  const [maxMatchNumber, players, playersWithStats] = await Promise.all([
    getLatestMatchNumber(tournamentId),
    getPlayers(),
    getPlayersWithStats(tournamentId),
  ]);

  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }

  return (
    <Matches
      maxMatchNumber={maxMatchNumber}
      players={players.data}
      user={user}
      playersWithStats={playersWithStats}
    />
  );
}
