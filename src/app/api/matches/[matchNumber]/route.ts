import {
  getMatchHandler,
  updateMatchHandler,
  deleteMatchHandler,
} from "@/app/features/matches/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler((req, context) =>
  getMatchHandler(req as NextRequest, context)
);

export const PUT = withErrorHandler((req, context) =>
  updateMatchHandler(req as NextRequest, context)
);

export const DELETE = withErrorHandler((req, context) =>
  deleteMatchHandler(req as NextRequest, context)
);
