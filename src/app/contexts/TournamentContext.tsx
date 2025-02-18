"use client";
import { createContext, useContext, useState } from "react";
import { SerializedTournament } from "../constants/types";

type TournamentContextType = {
  tournaments: SerializedTournament[];
  selectedTournament: SerializedTournament | null;
  setSelectedTournament: (tournament: SerializedTournament) => void;
};

const TournamentContext = createContext<TournamentContextType>({
  tournaments: [],
  selectedTournament: null,
  setSelectedTournament: () => {},
});

export const TournamentProvider = ({
  children,
  tournaments,
}: {
  children: React.ReactNode;
  tournaments: SerializedTournament[];
}) => {
  if (tournaments.length === 0) {
    throw new Error("Tournaments are required");
  }

  const [selectedTournament, setSelectedTournament] =
    useState<SerializedTournament | null>(tournaments[tournaments.length - 1]);

  return (
    <TournamentContext.Provider
      value={{ tournaments, selectedTournament, setSelectedTournament }}
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
