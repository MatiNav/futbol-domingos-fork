import ArmarEquipos from "@/app/components/ArmarEquipost";
import { getPlayers } from "@/app/features/players/utils/server";

export default async function ArmarEquiposPage() {
  const players = await getPlayers();

  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }

  return <ArmarEquipos players={players.data} />;
}
