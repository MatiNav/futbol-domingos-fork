import {
  updateOpinionHandler,
  deleteOpinionHandler,
} from "@/app/features/matches/api";

export const dynamic = "force-dynamic";

export const PUT = updateOpinionHandler;
export const DELETE = deleteOpinionHandler;
