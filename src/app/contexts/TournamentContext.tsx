"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SerializedTournament } from "../constants/types";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type TournamentContextType = {
  tournaments: SerializedTournament[];
  selectedTournament: SerializedTournament | null;
  setSelectedTournament: (tournament: SerializedTournament) => void;
  errorFetchingTournaments: Error | null;
  isLoadingTournaments: boolean;
};

const TournamentContext = createContext<TournamentContextType>({
  tournaments: [],
  selectedTournament: null,
  setSelectedTournament: () => {},
  errorFetchingTournaments: null,
  isLoadingTournaments: false,
});

export const TournamentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tournaments, setTournaments] = useState<SerializedTournament[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const tournamentId = searchParams.get("tournamentId");

  const [selectedTournament, setSelectedTournament] =
    useState<SerializedTournament | null>(getLastTournament(tournaments));

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoadingTournaments(true);
        const response = await fetch("/api/tournaments");
        const data = await response.json();
        setTournaments(data);
      } catch (error: unknown) {
        console.error("Error fetching tournaments", error);
        setError(error as Error);
      } finally {
        setIsLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    if (tournamentId) {
      setSelectedTournament(
        tournaments.find((t) => t._id === tournamentId) ||
          getLastTournament(tournaments)
      );
    } else {
      setSelectedTournament(getLastTournament(tournaments));
    }
  }, [tournaments, tournamentId]);

  const handleSetSelectedTournament = (tournament: SerializedTournament) => {
    setSelectedTournament(tournament);
    const url = new URL(window.location.href);
    url.searchParams.set("tournamentId", tournament._id);
    router.push(url.toString());
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        selectedTournament,
        setSelectedTournament: handleSetSelectedTournament,
        errorFetchingTournaments: error,
        isLoadingTournaments,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};

function getLastTournament(tournaments: SerializedTournament[]) {
  return tournaments.length > 0 ? tournaments[tournaments.length - 1] : null;
}
