import { PlayerWithStats } from "@/app/constants/types";
import { RANDOM_IMAGES } from "@/app/constants/images/teams";

export const getBannerCarousel = (
  players: PlayerWithStats[],
  pichichis: PlayerWithStats[],
  topPlayer: PlayerWithStats
) => {
  const ferPlayer = players.find((player) => player.name === "Fer");
  if (!ferPlayer) {
    throw new Error("Fer player not found");
  }
  const lastTournamentWinner = {
    title: "Campeón del 2024",
    player: ferPlayer,
    gradientFrom: "from-blue-900",
    gradientTo: "to-blue-600",
    image: RANDOM_IMAGES.ferCampeon,
    showGoals: false,
  };

  return [
    lastTournamentWinner,
    {
      title: "El Mejor Jugador",
      subtitle: "Liderando la tabla de posiciones",
      player: topPlayer,
      gradientFrom: "from-blue-900",
      gradientTo: "to-blue-600",
      showGoals: false,
    },
    ...(pichichis.length > 0
      ? [
          {
            title: "El Pichichi",
            player: pichichis[0],
            gradientFrom: "from-green-900",
            gradientTo: "to-green-600",
            showGoals: true,
          },
        ]
      : []),
  ];
};
