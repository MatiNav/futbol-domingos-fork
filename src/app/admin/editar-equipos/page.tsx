import EditarEquipos from "@/app/components/EditarEquipos";
import { getLatestMatchNumber } from "@/app/utils/server/matches";
import { getPlayers } from "@/app/utils/server/players";

export default async function EditarEquiposPage() {
  const maxMatchNumber = await getLatestMatchNumber();
  const players = await getPlayers();

  if ("error" in players) {
    return <div>Error: {players.error}</div>;
  }

  return (
    <EditarEquipos maxMatchNumber={maxMatchNumber} players={players.data} />
  );
}
