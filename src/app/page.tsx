import { getSession } from "@auth0/nextjs-auth0";
import HomePageContent from "./components/Home";
import { UserProfileWithPlayerId } from "./constants/types";
import { getPichichis } from "./utils/players";
import { getMessages } from "./utils/server/messages";
import { getPlayersWithStats } from "./utils/server/players";

export default async function HomePage() {
  const session = await getSession();
  const user = session?.user as UserProfileWithPlayerId;

  const [initialMessages, playersWithStats] = await Promise.all([
    getMessages(),
    getPlayersWithStats(),
  ]);
  const pichichis = getPichichis(playersWithStats);
  const topPlayer = playersWithStats[0];

  return (
    <HomePageContent
      initialMessages={initialMessages}
      playersWithStats={playersWithStats}
      pichichis={pichichis}
      topPlayer={topPlayer}
      user={user}
    />
  );
}
