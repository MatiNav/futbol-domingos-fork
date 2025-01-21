'use client';
import { useState } from 'react';
import Link from 'next/link';

const MOCK_PLAYERS = [
  "Carlos Vela",
  "Leo Suárez",
  "Diego Torres",
  "Juan Pérez",
  "Roberto Silva",
  "Miguel Ángel",
  "Andrés López",
  "Fernando Ruiz",
  "Pablo Martín",
  "Gabriel Soto"
];

export default function ArmarEquipos() {
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [searchTerms, setSearchTerms] = useState<{ [key: number]: { team1: string; team2: string } }>(
    Array(8).fill(null).reduce((acc, _, index) => ({
      ...acc,
      [index]: { team1: '', team2: '' }
    }), {})
  );

  const handlePlayerSelect = (player: string, team: 'team1' | 'team2', index: number) => {
    if (team === 'team1') {
      const newTeam1 = [...team1];
      newTeam1[index] = player;
      setTeam1(newTeam1);
      setSearchTerms(prev => ({
        ...prev,
        [index]: { ...prev[index], team1: '' }
      }));
    } else {
      const newTeam2 = [...team2];
      newTeam2[index] = player;
      setTeam2(newTeam2);
      setSearchTerms(prev => ({
        ...prev,
        [index]: { ...prev[index], team2: '' }
      }));
    }
  };

  const clearSelection = (index: number, team: 'team1' | 'team2') => {
    if (team === 'team1') {
      const newTeam1 = [...team1];
      newTeam1[index] = '';
      setTeam1(newTeam1);
    } else {
      const newTeam2 = [...team2];
      newTeam2[index] = '';
      setTeam2(newTeam2);
    }
  };

  const getFilteredPlayers = (searchTerm: string, index: number, team: 'team1' | 'team2') => {
    const usedPlayers = [...team1, ...team2].filter(Boolean);
    const currentTeamPlayer = team === 'team1' ? team1[index] : team2[index];
    
    return MOCK_PLAYERS.filter(player => 
      player.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!usedPlayers.includes(player) || player === currentTeamPlayer)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Armar Equipos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">Equipo 1</th>
                <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">Equipo 2</th>
              </tr>
            </thead>
            <tbody>
              {Array(8).fill(null).map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 bg-red-800">
                    <div className="relative">
                      <input
                        type="text"
                        value={team1[index] || searchTerms[index].team1}
                        onChange={(e) => {
                          setSearchTerms(prev => ({
                            ...prev,
                            [index]: { ...prev[index], team1: e.target.value }
                          }));
                        }}
                        className="w-full p-2.5 text-white bg-red-800 border-2 border-red-400 rounded-lg shadow-sm 
                          focus:border-red-300 focus:ring-2 focus:ring-red-300 
                          appearance-none cursor-pointer hover:bg-red-900 transition-colors pr-10
                          placeholder-red-300"
                        placeholder="Buscar jugador..."
                      />
                      {(team1[index] || searchTerms[index].team1) && (
                        <button
                          onClick={() => {
                            clearSelection(index, 'team1');
                            setSearchTerms(prev => ({
                              ...prev,
                              [index]: { ...prev[index], team1: '' }
                            }));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-red-300 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      )}
                      {searchTerms[index].team1 && !team1[index] && (
                        <div className="absolute z-10 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto bg-red-700 border-2 border-red-400">
                          {getFilteredPlayers(searchTerms[index].team1, index, 'team1').map(player => (
                            <div
                              key={player}
                              className="px-4 py-2 hover:bg-red-600 cursor-pointer text-white border-b border-red-600 last:border-b-0"
                              onClick={() => handlePlayerSelect(player, 'team1', index)}
                            >
                              {player}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 bg-blue-100">
                    <div className="relative">
                      <input
                        type="text"
                        value={team2[index] || searchTerms[index].team2}
                        onChange={(e) => {
                          setSearchTerms(prev => ({
                            ...prev,
                            [index]: { ...prev[index], team2: e.target.value }
                          }));
                        }}
                        className="w-full p-2.5 text-gray-800 bg-blue-100 border-2 border-blue-400 rounded-lg shadow-sm 
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-400 
                          appearance-none cursor-pointer hover:bg-blue-200 transition-colors pr-10
                          placeholder-blue-400"
                        placeholder="Buscar jugador..."
                      />
                      {(team2[index] || searchTerms[index].team2) && (
                        <button
                          onClick={() => {
                            clearSelection(index, 'team2');
                            setSearchTerms(prev => ({
                              ...prev,
                              [index]: { ...prev[index], team2: '' }
                            }));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                      {searchTerms[index].team2 && !team2[index] && (
                        <div className="absolute z-10 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto bg-white border-2 border-blue-400">
                          {getFilteredPlayers(searchTerms[index].team2, index, 'team2').map(player => (
                            <div
                              key={player}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 border-b border-blue-200 last:border-b-0"
                              onClick={() => handlePlayerSelect(player, 'team2', index)}
                            >
                              {player}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 