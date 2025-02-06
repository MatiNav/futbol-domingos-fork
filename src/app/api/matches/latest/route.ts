import { NextResponse } from "next/server";
import { getLatestMatchNumber } from "@/app/features/matches/utils/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const maxMatchNumber = await getLatestMatchNumber();
    return NextResponse.json({ maxMatchNumber });
  } catch (error) {
    console.error("Error fetching max match number:", error);
    return NextResponse.json(
      { error: "Error fetching max match number" },
      { status: 500 }
    );
  }
}
