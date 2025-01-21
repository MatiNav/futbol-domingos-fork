import Image from 'next/image';

const DEFAULT_PLAYER_IMAGE = "https://cdn-icons-png.flaticon.com/512/166/166344.png";

const MOCK_PLAYERS = [
  { name: "Carlos Vela", played: 15, won: 10, drawn: 3, lost: 2, points: 33, goals: 25, efficiency: 73.3 },
  { name: "Leo Suárez", played: 15, won: 9, drawn: 4, lost: 2, points: 31, goals: 18, efficiency: 68.9 },
  { name: "Diego Torres", played: 14, won: 8, drawn: 4, lost: 2, points: 28, goals: 20, efficiency: 66.7 },
  { name: "Juan Pérez", played: 15, won: 8, drawn: 3, lost: 4, points: 27, goals: 15, efficiency: 60.0 },
  { name: "Roberto Silva", played: 13, won: 7, drawn: 4, lost: 2, points: 25, goals: 12, efficiency: 64.1 },
  { name: "Miguel Ángel", played: 15, won: 7, drawn: 3, lost: 5, points: 24, goals: 14, efficiency: 53.3 },
  { name: "Andrés López", played: 14, won: 6, drawn: 5, lost: 3, points: 23, goals: 10, efficiency: 54.8 },
  { name: "Fernando Ruiz", played: 15, won: 6, drawn: 4, lost: 5, points: 22, goals: 11, efficiency: 48.9 },
  { name: "Pablo Martín", played: 13, won: 5, drawn: 4, lost: 4, points: 19, goals: 8, efficiency: 48.7 },
  { name: "Gabriel Soto", played: 14, won: 4, drawn: 5, lost: 5, points: 17, goals: 7, efficiency: 40.5 },
];

export default function Table() {
  return (
    <div className="min-h-screen bg-green-500 p-4">
      <h1 className="text-2xl font-bold text-white text-center mb-4">
        Clausura 2025
      </h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-max">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
              <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">Pos</th>
              <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-128">Jugador</th>
              <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-16">PJ</th>
              <th className="px-4 py-3 text-green-800 font-bold uppercase tracking-wider text-sm w-16">G</th>
              <th className="px-4 py-3 text-orange-500 font-bold uppercase tracking-wider text-sm w-16">E</th>
              <th className="px-4 py-3 text-red-800 font-bold uppercase tracking-wider text-sm w-16">P</th>
              <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-16">Pts</th>
              <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-16">GF</th>
              <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-16">%</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PLAYERS.map((player, index) => (
              <tr key={index} className="border-t text-gray-800 hover:bg-gray-50">
                <td className="px-4 py-2 text-center whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={DEFAULT_PLAYER_IMAGE}
                      alt={player.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="whitespace-nowrap">{player.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-center whitespace-nowrap">{player.played}</td>
                <td className="px-4 py-2 text-center whitespace-nowrap text-green-800">{player.won}</td>
                <td className="px-4 py-2 text-center whitespace-nowrap text-orange-500">{player.drawn}</td>
                <td className="px-4 py-2 text-center whitespace-nowrap text-red-800">{player.lost}</td>
                <td className="px-4 py-2 text-center font-bold whitespace-nowrap">{player.points}</td>
                <td className="px-4 py-2 text-center whitespace-nowrap">{player.goals}</td>
                <td className="px-4 py-2 text-center whitespace-nowrap">{player.efficiency.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 