import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";

type MatchParams = {
  matchNumber: string;
};

export async function deleteMatchHandler(
  request: Request,
  { params }: { params: MatchParams }
) {
  try {
    const matchNumber = parseInt(params.matchNumber);

    const matchesCollection = await getCollection("matches");

    await matchesCollection.updateOne(
      { matchNumber, deletedAt: { $exists: false } },
      { $set: { deletedAt: new Date() } }
    );

    return NextResponse.json({
      message: "Match removed successfully",
    });
  } catch (error) {
    console.error("Error removing match:", error);
    return NextResponse.json(
      { error: "Error removing match" },
      { status: 500 }
    );
  }
}
