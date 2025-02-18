import {
  updateOpinionHandler,
  deleteOpinionHandler,
} from "@/app/features/matches/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export const PUT = withErrorHandler((req, context) =>
  updateOpinionHandler(req as NextRequest, context)
);
export const DELETE = withErrorHandler((req, context) =>
  deleteOpinionHandler(req as NextRequest, context)
);
