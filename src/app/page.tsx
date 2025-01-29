import HomePageContent from "./components/Home";
import { getPlayers } from "./utils/players";
import { getPichichis } from "./utils/players";

export default async function HomePage() {
  const players = await getPlayers();
  const pichichis = getPichichis(players);
  const topPlayer = players[0];

  return (
    <HomePageContent
      players={players}
      pichichis={pichichis}
      topPlayer={topPlayer}
    />
  );
}
