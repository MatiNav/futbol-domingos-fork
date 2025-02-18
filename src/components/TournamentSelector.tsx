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
    <div className="flex justify-center my-4">
      <select
        onChange={handleChange}
        value={selectedTournament ? selectedTournament._id : ""}
        className="px-4 py-2 bg-[#1a472a] text-white rounded-lg border border-green-700 
                 cursor-pointer hover:bg-[#143620] transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent
                 appearance-none w-64 text-center"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          backgroundSize: "1em",
        }}
      >
        <option value="" disabled>
          Selecciona un Torneo
        </option>
        {tournaments.map((tournament) => (
          <option
            key={tournament._id}
            value={tournament._id}
            className="bg-[#1a472a] text-white"
          >
            {tournament.name}
          </option>
        ))}
      </select>
    </div>
  );
}
