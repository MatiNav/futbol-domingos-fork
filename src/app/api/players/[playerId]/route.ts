import { updatePlayerHandler } from "@/app/features/players/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const PUT = withErrorHandler(updatePlayerHandler);
