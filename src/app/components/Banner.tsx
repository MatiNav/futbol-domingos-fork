import Image from "next/image";
import { PlayerWithStats } from "../constants/types/db-models/Player";

interface BannerProps {
  title: string;
  subtitle: string;
  player: PlayerWithStats;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function Banner({
  title,
  subtitle,
  player,
  gradientFrom = "from-green-600",
  gradientTo = "to-green-900",
}: BannerProps) {
  return (
    <div
      className={`w-full rounded-xl overflow-hidden relative mb-8 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
    >
      <div className="flex items-center justify-between p-6">
        <div className="z-10">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-green-100 mb-4">{subtitle}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 inline-block">
            <p className="text-white font-semibold">{player.name}</p>
            <p className="text-sm text-green-100">Goles: {player.goals}</p>
          </div>
        </div>
        {player.image && (
          <div className="relative h-32 w-32">
            <Image
              src={player.image}
              alt={player.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
