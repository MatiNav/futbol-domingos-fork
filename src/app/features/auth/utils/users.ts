import "server-only";
import { getSession } from "@auth0/nextjs-auth0";
import { UserProfileWithPlayerId } from "@/app/constants/types";
import { redirect } from "next/navigation";
import { getCollection } from "../../../utils/server/db";

export async function getAuthenticatedUser() {
  const session = await getSession();

  const user = session?.user as UserProfileWithPlayerId;

  if (!user) {
    return null;
  }

  if (!user.email) {
    redirect("/confirmar-email");
  }

  const playersCollection = await getCollection("players");

  const player = await playersCollection.findOne({
    email: user.email,
  });

  if (!player) {
    redirect("/confirmar-email");
  }

  return user;
}
