import ProfileContent from "../components/Profile";
import { getAuthenticatedUser } from "../utils/server/users";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  console.log(user, "user");

  return <ProfileContent user={user} />;
}
