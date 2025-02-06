import { getSession } from "@auth0/nextjs-auth0";
import ProfileContent from "../components/Profile";
import { UserProfileWithPlayerId } from "../constants/types";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  if (!user) return <div> Por favor, inicia sesión para ver tu perfil. </div>;

  return <ProfileContent user={user} />;
}
