'use client';
import { useState } from 'react';

type Match = {
  team1: string[];
  team2: string[];
  goalsTeam1: number[];
  goalsTeam2: number[];
};

type MatchesData = {
  [key: number]: Match;
};

// Mock data using players from table page
const MOCK_MATCHES: MatchesData = {
  1: {
    team1: ["Carlos Vela", "Leo Suárez", "Diego Torres", "Juan Pérez", "Roberto Silva", "Miguel Ángel", "Andrés López", "Fernando Ruiz"],
    team2: ["Pablo Martín", "Gabriel Soto", "Diego Torres", "Juan Pérez", "Roberto Silva", "Miguel Ángel", "Andrés López", "Fernando Ruiz"],
    goalsTeam1: [2, 1, 0, 0, 0, 0, 0, 0],
    goalsTeam2: [0, 0, 1, 0, 0, 0, 0, 0]
  },
  2: {
    team1: ["Gabriel Soto", "Pablo Martín", "Fernando Ruiz", "Andrés López", "Miguel Ángel", "Roberto Silva", "Juan Pérez", "Diego Torres"],
    team2: ["Carlos Vela", "Leo Suárez", "Diego Torres", "Juan Pérez", "Roberto Silva", "Miguel Ángel", "Andrés López", "Fernando Ruiz"],
    goalsTeam1: [0, 0, 0, 1, 0, 0, 0, 0],
    goalsTeam2: [3, 0, 0, 0, 0, 0, 0, 0]
  },
  3: {
    team1: ["Leo Suárez", "Carlos Vela", "Roberto Silva", "Miguel Ángel", "Andrés López", "Fernando Ruiz", "Pablo Martín", "Gabriel Soto"],
    team2: ["Diego Torres", "Juan Pérez", "Roberto Silva", "Miguel Ángel", "Andrés López", "Fernando Ruiz", "Pablo Martín", "Gabriel Soto"],
    goalsTeam1: [2, 2, 0, 0, 0, 0, 0, 0],
    goalsTeam2: [1, 1, 0, 0, 0, 0, 0, 0]
  }
};

export default function Matches() {
  const [matchNumber, setMatchNumber] = useState('');
  const selectedMatch = MOCK_MATCHES[Number(matchNumber)];

  const calculateTotalGoals = (goals: number[]) => goals.reduce((sum, goal) => sum + goal, 0);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <label htmlFor="matchNumber" className="block text-lg font-semibold text-gray-700 mb-2">
            Buscar Partido
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <input
              id="matchNumber"
              type="number"
              min="1"
              max="3"
              value={matchNumber}
              onChange={(e) => setMatchNumber(e.target.value)}
              placeholder="Ingresa el número de partido (1-3)"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-gray-800 placeholder-gray-400 transition-all duration-200"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Ingresa un número de partido (1-3) para ver los detalles
          </p>
        </div>
      </div>

      {selectedMatch && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">Goles</th>
                  <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">Equipo 1</th>
                  <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">Equipo 2</th>
                  <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">Goles</th>
                </tr>
              </thead>
              <tbody>
                {selectedMatch.team1.map((player, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-center text-gray-800 font-semibold">
                      {selectedMatch.goalsTeam1[index] || '-'}
                    </td>
                    <td className="px-4 py-2 text-gray-800 bg-red-400">{player}</td>
                    <td className="px-4 py-2 text-gray-800 bg-blue-300">{selectedMatch.team2[index]}</td>
                    <td className="px-4 py-2 text-center text-gray-800 font-semibold">
                      {selectedMatch.goalsTeam2[index] || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">Resultado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-center font-bold text-xl text-black">
                    {calculateTotalGoals(selectedMatch.goalsTeam1)} - {calculateTotalGoals(selectedMatch.goalsTeam2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 