"use client";

import React from "react";
import { useTournament } from "@/app/contexts/TournamentContext";

export default function TournamentSelector() {
  const {
    selectedTournamentData,
    setSelectedTournamentData,
    tournamentsData,
    isLoadingTournaments,
  } = useTournament();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTournament = tournamentsData.find(
      (t) => t.tournament._id === e.target.value
    );
    if (selectedTournament) {
      setSelectedTournamentData(selectedTournament);
    }
  };

  return (
    <div className="flex justify-center py-2 bg-[#0B2818]">
      {!isLoadingTournaments && (
        <select
          onChange={handleChange}
          value={selectedTournamentData?.tournament._id || ""}
          className="px-3 py-1 bg-[#1a472a]/80 backdrop-blur-sm text-white text-sm 
                  rounded-lg border border-green-700/50 
                  cursor-pointer hover:bg-[#1a472a] transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-transparent
                  appearance-none text-center w-full max-w-md mx-4"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "1em",
          }}
        >
          <option value="" disabled className="bg-[#1a472a]">
            Selecciona un Torneo
          </option>
          {tournamentsData.map((tournamentData) => (
            <option
              key={tournamentData.tournament._id}
              value={tournamentData.tournament._id}
              className="bg-[#1a472a]"
            >
              {tournamentData.tournament.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
