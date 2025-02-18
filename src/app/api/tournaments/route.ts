import getTournamentsHandler from "@/app/features/tournaments/api/getTournaments";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const GET = withErrorHandler(getTournamentsHandler);
