import HomePageContent from "./components/Home";
import { getPichichis } from "./utils/players";
import { getPlayers } from "./utils/server/players";
import { getAuthenticatedUser } from "./utils/server/users";

export default async function HomePage() {
  const players = await getPlayers();
  const pichichis = getPichichis(players);
  const topPlayer = players[0];
  const user = await getAuthenticatedUser();

  console.log(user, "user");
  return (
    <div>
      <HomePageContent
        players={players}
        pichichis={pichichis}
        topPlayer={topPlayer}
      />
    </div>
  );
}
