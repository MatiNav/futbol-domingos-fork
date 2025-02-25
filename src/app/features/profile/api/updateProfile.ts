import { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../auth/utils";
import { BadRequestError } from "@/app/utils/server/errors";
import { getCollection } from "@/app/utils/server/db";

export async function updateProfileHandler(request: NextRequest) {
  const user = await getAuthenticatedUser(true);
  const { favoriteTeam } = await request.json();

  if (!favoriteTeam) {
    throw new BadRequestError("Missing favoriteTeam");
  }

  const playersCollection = await getCollection("players");

  await playersCollection.updateOne(
    { email: user.email },
    {
      $set: {
        favoriteTeam,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ message: "Profile updated successfully" });
}
