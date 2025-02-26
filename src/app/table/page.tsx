import { getPlayersWithStats } from "@/app/features/players/utils/server";
import { getPichichis } from "@/app/features/players/utils";
import { ParsedUrlQuery } from "querystring";
import { getTournamentIdFromParams } from "@/app/utils/url";
import TableContent from "../features/table/components/TableContent";

export const dynamic = "force-dynamic";

export default async function TablePage({
  searchParams,
}: {
  searchParams: ParsedUrlQuery;
}) {
  const tournamentId = await getTournamentIdFromParams(searchParams);
  const playersWithStats = await getPlayersWithStats(tournamentId);
  const pichichis = getPichichis(playersWithStats);

  return (
    <TableContent playersWithStats={playersWithStats} pichichis={pichichis} />
  );
}
