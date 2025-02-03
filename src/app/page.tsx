import HomePageContent from "./components/Home";
import { getPichichis } from "./utils/players";
import { getPlayersWithStats } from "./utils/server/players";
import { getAuthenticatedUser } from "./utils/server/users";

export default async function HomePage() {
  const playersWithStats = await getPlayersWithStats();
  const pichichis = getPichichis(playersWithStats);
  const topPlayer = playersWithStats[0];
  const authenticatedUser = await getAuthenticatedUser();

  return (
    <div>
      <HomePageContent
        playersWithStats={playersWithStats}
        pichichis={pichichis}
        topPlayer={topPlayer}
        authenticatedUser={authenticatedUser}
      />
    </div>
  );
}
