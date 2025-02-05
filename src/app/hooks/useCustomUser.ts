import { useUser } from "@auth0/nextjs-auth0/client";
import { UserProfileWithPlayerId } from "../constants/types";

export function useCustomUser() {
  const { user } = useUser();
  if (!user) return null;
  return user as UserProfileWithPlayerId;
}
