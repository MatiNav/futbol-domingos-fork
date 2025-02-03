import "server-only";
import clientPromise from "@/lib/mongodb";
import { Claims, getSession } from "@auth0/nextjs-auth0";
import { DBPlayer } from "@/app/constants/types/db-models/Player";
import { redirect } from "next/navigation";

export type AuthenticatedUserData = {
  auth0: Claims;
  dbData: DBPlayer;
};

export async function getAuthenticatedUser() {
  const session = await getSession();

  const user = session?.user;

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

  return {
    auth0: user,
    dbData: player,
  };
}
