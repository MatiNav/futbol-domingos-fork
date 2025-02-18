import { UserProfileWithPlayerId } from "@/app/constants/types";

export const isAdmin = (user: UserProfileWithPlayerId | null) => {
  return user?.role === "admin";
};
