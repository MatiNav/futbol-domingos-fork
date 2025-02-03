import Matches from "../components/Matches";
import { getAuthenticatedUser } from "../utils/server/users";

export default async function MatchesPage() {
  const authenticatedUser = await getAuthenticatedUser();

  return <Matches authenticatedUser={authenticatedUser} />;
}
