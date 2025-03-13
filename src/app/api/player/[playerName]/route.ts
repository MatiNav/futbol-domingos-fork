import { getPlayerStatsHandler } from "@/app/features/player/getPlayerWithStats";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const GET = withErrorHandler(getPlayerStatsHandler);
