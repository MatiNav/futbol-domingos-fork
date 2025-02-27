import { getSession } from "@auth0/nextjs-auth0";
import { UserProfileWithPlayerId } from "../constants/types";
import ProfileContent from "../features/profile/components/Profile";
import { getReadSignedUrlProfileImage } from "../features/profile/utils/getProfileImageSignedUrl";

export default async function ProfilePage() {
  //TODO: replace all this user authenticated logic this by using a middleware
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  if (!user) return <div> Por favor, inicia sesión para ver tu perfil. </div>;

  const profileImageUrl = await getReadSignedUrlProfileImage();
  return <ProfileContent user={user} profileImageUrl={profileImageUrl} />;
}
