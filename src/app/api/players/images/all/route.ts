import { getAllPlayersImages } from "@/app/features/players/api/images/all";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const GET = withErrorHandler(getAllPlayersImages);
