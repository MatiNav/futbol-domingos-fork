import { NextRequest, NextResponse } from "next/server";
import { getLatestMatchNumber } from "../utils/server";
import { BadRequestError } from "@/app/utils/server/errors";

export async function getLatestMatchNumberHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get("tournamentId");

  if (!tournamentId) {
    throw new BadRequestError("Tournament ID is required");
  }

  const maxMatchNumber = await getLatestMatchNumber(tournamentId);

  return NextResponse.json({ maxMatchNumber });
}
