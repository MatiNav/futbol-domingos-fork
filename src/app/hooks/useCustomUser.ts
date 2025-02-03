import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { TeamOption } from "../constants/common";

type UserProfileWithPlayerId = UserProfile & {
  displayName: string;
  favoriteTeam: TeamOption;
  playerId: string;
  role: string;
  image: string;
};

export function useCustomUser() {
  const { user } = useUser();
  if (!user) return null;
  return user as UserProfileWithPlayerId;
}
