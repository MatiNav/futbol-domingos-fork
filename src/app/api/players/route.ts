import {
  createPlayerHandler,
  getPlayersHandler,
} from "@/app/features/players/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const GET = withErrorHandler(getPlayersHandler);
export const POST = withErrorHandler(createPlayerHandler);
