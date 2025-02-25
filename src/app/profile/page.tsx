import { getSession } from "@auth0/nextjs-auth0";
import { UserProfileWithPlayerId } from "../constants/types";
import ProfileContent from "../features/profile/components/Profile";
import { getSignedUrlProfileImage } from "../features/profile/utils/getSignedUrl";
import { isImageUrl } from "../utils/image";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  if (!user) return <div> Por favor, inicia sesión para ver tu perfil. </div>;

  const imageUrl = await getSignedUrlProfileImage("read");
  const isImage = await isImageUrl(imageUrl);
  const profileImageUrl = isImage ? imageUrl : null;

  return <ProfileContent user={user} profileImageUrl={profileImageUrl} />;
}
