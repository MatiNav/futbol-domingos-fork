import { PlayerWithStats } from "@/app/constants/types";
import { RANDOM_IMAGES } from "@/app/constants/images/teams";

export const getBannerCarousel = (
  players: PlayerWithStats[],
  pichichis: PlayerWithStats[],
  topPlayer: PlayerWithStats
) => {
  const lastTourmentChampion = players.find(
    (player) => player.name === "Santy99"
  );
  if (!lastTourmentChampion) {
    throw new Error("Last tournament champion not found");
  }

  const actualYear = new Date().getFullYear();

  const champions = {
    title: `Campeones`,
    player: lastTourmentChampion,
    gradientFrom: "from-blue-900",
    gradientTo: "to-blue-600",
    image: RANDOM_IMAGES.campeones2025,
    showGoals: false,
  };

  const lastTournamentWinner = {
    title: `Campeón ${actualYear}`,
    player: lastTourmentChampion,
    gradientFrom: "from-blue-900",
    gradientTo: "to-blue-600",
    image: RANDOM_IMAGES.nicopcampeon,
    showGoals: false,
  };

  return [
    lastTournamentWinner,
    champions,
    ...(topPlayer.goals > 0
      ? [
          {
            title: "El Mejor Jugador",
            subtitle: "Liderando la tabla de posiciones",
            player: topPlayer,
            gradientFrom: "from-blue-900",
            gradientTo: "to-blue-600",
            showGoals: false,
          },
        ]
      : []),
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
