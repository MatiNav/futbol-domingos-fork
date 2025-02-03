import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/app/utils/server/users";
export const PUT = withApiAuthRequired(async function updateProfile(
  req: NextRequest
) {
  try {
    const user = await getAuthenticatedUser();
    const { displayName, favoriteTeam } = await req.json();

    console.log(displayName, favoriteTeam, "displayName, favoriteTeam");
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!displayName || !favoriteTeam) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("futbol");
    const playersCollection = db.collection("players");

    await playersCollection.updateOne(
      { email: user.dbData.email },
      {
        $set: {
          displayName,
          favoriteTeam,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Error updating profile" },
      { status: 500 }
    );
  }
});
