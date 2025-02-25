import { getSession } from "@auth0/nextjs-auth0";
import { UserProfileWithPlayerId } from "../constants/types";
import ProfileContent from "../features/profile/components/Profile";
import { getSignedUrlProfileImage } from "../features/profile/utils/getSignedUrl";

async function isImageUrl(url: string) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");
  return contentType?.startsWith("image/");
}

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  if (!user) return <div> Por favor, inicia sesión para ver tu perfil. </div>;

  const imageUrl = await getSignedUrlProfileImage("read");
  const isImage = await isImageUrl(imageUrl);
  const profileImageUrl = isImage ? imageUrl : null;
  console.log("imageUrl", imageUrl);

  return <ProfileContent user={user} profileImageUrl={profileImageUrl} />;
}
