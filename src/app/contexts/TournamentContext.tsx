"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SerializedTournament } from "../constants/types";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type TournamentContextType = {
  tournaments: SerializedTournament[];
  selectedTournament: SerializedTournament;
  setSelectedTournament: (tournament: SerializedTournament) => void;
};

const TournamentContext = createContext<TournamentContextType>({
  tournaments: [],
  selectedTournament: {} as SerializedTournament,
  setSelectedTournament: () => {},
});

export const TournamentProvider = ({
  children,
  tournaments,
}: {
  children: React.ReactNode;
  tournaments: SerializedTournament[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastTournament = tournaments[tournaments.length - 1];

  const [selectedTournament, setSelectedTournament] =
    useState<SerializedTournament>(lastTournament);

  useEffect(() => {
    const tournamentId = searchParams.get("tournamentId");
    if (
      tournamentId &&
      selectedTournament &&
      selectedTournament._id !== tournamentId
    ) {
      setSelectedTournament(
        tournaments.find((t) => t._id === tournamentId) || lastTournament
      );
    }
  }, [tournaments, selectedTournament, searchParams, lastTournament]);

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
