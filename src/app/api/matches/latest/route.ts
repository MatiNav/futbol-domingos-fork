import { getLatestMatchNumberHandler } from "@/app/features/matches/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler((req) =>
  getLatestMatchNumberHandler(req as NextRequest)
);
