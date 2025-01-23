import Image from "next/image";
import clientPromise from "@/lib/mongodb";

interface Player {
  _id: string;
  name: string;
  image: string;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
}

interface PlayerWithStats extends Player {
  points: number;
  percentage: number;
  position: number;
}

const DEFAULT_PLAYER_IMAGE_1 =
  "https://cdn-icons-png.flaticon.com/512/166/166344.png";
const DEFAULT_PLAYER_IMAGE_2 =
  "https://img.lovepik.com/element/40127/4259.png_1200.png";

async function getPlayers(): Promise<PlayerWithStats[]> {
  const client = await clientPromise;
  const db = client.db("futbol");
  const collection = db.collection("players");

  const players = (await collection.find({}).toArray()) as unknown as Player[];

  // Calculate stats and sort players
  const playersWithStats = players.map((player) => {
    const points = player.wins * 3 + player.draws;
    const totalGames = player.wins + player.draws + player.losses;
    const maxPoints = totalGames * 3;
    const percentage = totalGames === 0 ? 0 : (points / maxPoints) * 100;

    return {
      ...player,
      points,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    };
  });

  // Sort by points (desc), then goals (desc)
  const sortedPlayers = playersWithStats.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.goals - a.goals;
  });

  // Add position
  return sortedPlayers.map((player, index) => ({
    ...player,
    position: index + 1,
  }));
}

export default async function TablePage() {
  const players = await getPlayers();

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" 
         style={{
           backgroundImage: `url('https://www.ringtina.com.ar/Descargar/Fondos%20de%20Pantalla/Deportes/ImgDeportes%20056.jpg')`,
         }}>
      <div className="min-h-screen bg-black/50 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 w-full my-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      Pos
                    </th>
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      Jugador
                    </th>
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      J
                    </th>
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      G
                    </th>
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      E
                    </th>
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      P
                    </th>
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      Pts
                    </th>
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      GF
                    </th>
                    <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={player._id} className="border-t hover:bg-gray-50 text-black">
                      <td className="px-4 py-3 text-center">
                        {player.position}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <Image
                              src={
                                player.image ||
                                (index % 2 === 0
                                  ? DEFAULT_PLAYER_IMAGE_1
                                  : DEFAULT_PLAYER_IMAGE_2)
                              }
                              alt={player.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>

                          <div>{player.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {player.wins + player.draws + player.losses}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap text-green-800">
                        {player.wins}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap text-orange-500">
                        {player.draws}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap text-red-800">
                        {player.losses}
                      </td>
                      <td className="px-4 py-2 text-center font-bold whitespace-nowrap">
                        {player.points}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {player.goals}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        {player.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
