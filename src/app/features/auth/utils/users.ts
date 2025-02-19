import "server-only";

import { getSession } from "@auth0/nextjs-auth0";
import { UserProfileWithPlayerId } from "@/app/constants/types";
import { redirect } from "next/navigation";
import { getCollection } from "../../../utils/server/db";
import { UnauthorizedError } from "@/app/utils/server/errors";

export async function getAuthenticatedUser(
  withError?: false
): Promise<UserProfileWithPlayerId | null>;
export async function getAuthenticatedUser(
  withError?: true
): Promise<UserProfileWithPlayerId>;
export async function getAuthenticatedUser(withError = false) {
  const session = await getSession();

  const user = session?.user as UserProfileWithPlayerId;

  if (!user) {
    if (withError) {
      throw new UnauthorizedError("Not authenticated");
    }
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
