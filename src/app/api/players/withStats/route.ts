import { getPlayersWithStatsHandler } from "@/app/features/players/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const GET = withErrorHandler(getPlayersWithStatsHandler);
