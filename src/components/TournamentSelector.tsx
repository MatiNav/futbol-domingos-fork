"use client";

import React from "react";
import { useTournament } from "@/app/contexts/TournamentContext";

export default function TournamentSelector() {
  const { selectedTournament, setSelectedTournament, tournaments } =
    useTournament();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTournament = tournaments.find(
      (t) => t._id === e.target.value
    );
    if (selectedTournament) {
      setSelectedTournament(selectedTournament);
    }
  };

  return (
    <div className="flex justify-center py-2 bg-[#0B2818]">
      <select
        onChange={handleChange}
        value={selectedTournament ? selectedTournament._id : ""}
        className="px-3 py-1 bg-[#1a472a]/80 backdrop-blur-sm text-white text-sm 
                  rounded-lg border border-green-700/50 
                  cursor-pointer hover:bg-[#1a472a] transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-transparent
                  appearance-none w-48 text-center"
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
        {tournaments.map((tournament) => (
          <option
            key={tournament._id}
            value={tournament._id}
            className="bg-[#1a472a]"
          >
            {tournament.name}
          </option>
        ))}
      </select>
    </div>
  );
}
