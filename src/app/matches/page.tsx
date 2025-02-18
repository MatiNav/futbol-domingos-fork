import { getSession } from "@auth0/nextjs-auth0";
import Matches from "../features/matches/components/Matches";
import { UserProfileWithPlayerId } from "../constants/types";
import { getLatestMatchNumber } from "@/app/features/matches/utils/server";
import { getPlayers } from "@/app/features/players/utils/server";
import { ParsedUrlQuery } from "querystring";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: ParsedUrlQuery;
}) {
  const tournamentId = searchParams.tournamentId as string;
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  const maxMatchNumber = await getLatestMatchNumber(tournamentId);
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
