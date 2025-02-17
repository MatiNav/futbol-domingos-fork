import {
  getMatchHandler,
  updateMatchHandler,
  deleteMatchHandler,
} from "@/app/features/matches/api";

export const dynamic = "force-dynamic";

export const GET = getMatchHandler;

export const PUT = updateMatchHandler;

export const DELETE = deleteMatchHandler;
