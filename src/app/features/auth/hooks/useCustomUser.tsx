import { useUser } from "@auth0/nextjs-auth0/client";
import { UserProfileWithPlayerId } from "@/app/constants/types";
export default function useCustomUser() {
  const { user } = useUser();
  return user as UserProfileWithPlayerId;
}
