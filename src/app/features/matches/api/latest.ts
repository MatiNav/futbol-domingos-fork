import { NextResponse } from "next/server";
import { getLatestMatchNumber } from "../utils/server";

export async function getLatestMatchNumberHandler() {
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
