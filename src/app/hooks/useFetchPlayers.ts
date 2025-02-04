import { useEffect, useState } from "react";
import { DBPlayer } from "../constants/types";

export function useFetchPlayers() {
  const [playersMap, setPlayersMap] = useState<{ [key: string]: DBPlayer }>({});
  const [players, setPlayers] = useState<DBPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/players");
        const data = (await response.json()) as { players: DBPlayer[] };
        setPlayersMap(
          data.players.reduce(
            (acc: { [key: string]: DBPlayer }, player: DBPlayer) => {
              acc[player._id.toString()] = player;
              return acc;
            },
            {} as { [key: string]: DBPlayer }
          )
        );
        setPlayers(data.players);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return { playersMap, players, isLoading, error };
}
