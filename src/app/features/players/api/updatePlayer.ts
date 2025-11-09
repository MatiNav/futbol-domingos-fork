import { updatePlayer } from "@/app/features/players/utils/server";
import { RouteHandlerContext } from "@/app/utils/server/withErrorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function updatePlayerHandler(
  request: NextRequest,
  context: RouteHandlerContext
) {
  try {
    const playerId = context.params.playerId as string;
    const updateData = await request.json();

    // Validate required fields
    if (updateData.name && typeof updateData.name !== "string") {
      return NextResponse.json(
        { error: "Name must be a string" },
        { status: 400 }
      );
    }

    if (updateData.email && typeof updateData.email !== "string") {
      return NextResponse.json(
        { error: "Email must be a string" },
        { status: 400 }
      );
    }

    if (
      updateData.favoriteTeam &&
      typeof updateData.favoriteTeam !== "string"
    ) {
      return NextResponse.json(
        { error: "Favorite team must be a string" },
        { status: 400 }
      );
    }

    if (updateData.image && typeof updateData.image !== "string") {
      return NextResponse.json(
        { error: "Image must be a string" },
        { status: 400 }
      );
    }

    if (updateData.role && !["admin", "user"].includes(updateData.role)) {
      return NextResponse.json(
        { error: "Role must be either 'admin' or 'user'" },
        { status: 400 }
      );
    }

    const result = await updatePlayer(playerId, updateData);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({ player: result.data });
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json(
      { error: "Error updating player" },
      { status: 500 }
    );
  }
}
