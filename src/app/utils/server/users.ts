import "server-only";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { DBPlayer, UserProfileWithPlayerId } from "@/app/constants/types";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
  const session = await getSession();

  const user = session?.user as UserProfileWithPlayerId;

  if (!user) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db("futbol");
  const playersCollection = db.collection("players");

  const player = await playersCollection.findOne<DBPlayer>({
    email: user.email,
  });

  if (!player) {
    redirect("/confirmar-email");
  }

  return user;
}
