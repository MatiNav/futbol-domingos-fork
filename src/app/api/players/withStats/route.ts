import { getPlayersWithStatsHandler } from "@/app/features/players/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";
import { NextRequest } from "next/server";

export const GET = withErrorHandler((req) =>
  getPlayersWithStatsHandler(req as NextRequest)
);
