import {
  getMatchHandler,
  updateMatchHandler,
  deleteMatchHandler,
} from "@/app/features/matches/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler(getMatchHandler);

export const PUT = withErrorHandler(updateMatchHandler);

export const DELETE = withErrorHandler(deleteMatchHandler);
