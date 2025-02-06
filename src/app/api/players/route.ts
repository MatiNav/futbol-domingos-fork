import {
  createPlayerHandler,
  getPlayersHandler,
} from "@/app/features/players/api";

export const GET = getPlayersHandler;
export const POST = createPlayerHandler;
