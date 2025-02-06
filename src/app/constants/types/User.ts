import { UserProfile } from "@auth0/nextjs-auth0/client";
import { TeamOption } from "./Common";

export type UserProfileWithPlayerId = UserProfile & {
  displayName: string; // name in our db
  favoriteTeam: TeamOption;
  playerId: string;
  role: string;
  image: string;
};
