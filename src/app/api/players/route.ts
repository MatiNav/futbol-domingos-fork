import { createPlayerHandler } from "@/app/features/players/api";
import { getPlayers } from "@/app/features/players/utils/server";

export const GET = getPlayers;
export const POST = createPlayerHandler;
