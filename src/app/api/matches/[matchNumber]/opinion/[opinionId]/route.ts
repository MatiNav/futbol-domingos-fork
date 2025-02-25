import {
  updateOpinionHandler,
  deleteOpinionHandler,
} from "@/app/features/matches/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const dynamic = "force-dynamic";

export const PUT = withErrorHandler(updateOpinionHandler);
export const DELETE = withErrorHandler(deleteOpinionHandler);
