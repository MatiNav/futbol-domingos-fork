import { getSession } from "@auth0/nextjs-auth0";
import { UserProfileWithPlayerId } from "../constants/types";
import ProfileContent from "../features/profile/components/Profile";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  if (!user) return <div> Por favor, inicia sesión para ver tu perfil. </div>;

  return <ProfileContent user={user} />;
}
