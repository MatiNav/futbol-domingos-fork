import { useState, useEffect } from "react";
import { PlayerWithStats } from "../constants/types/db-models/Player";
import Image from "next/image";
import TEAMS_IMAGES from "../constants/images/teams";

interface BannerData {
  title: string;
  subtitle?: string;
  player: PlayerWithStats;
  gradientFrom?: string;
  gradientTo?: string;
  image?: string;
  showGoals: boolean;
}

interface BannerCarouselProps {
  banners: BannerData[];
  autoPlayInterval?: number;
}

export default function BannerCarousel({
  banners,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((current) => (current + 1) % banners.length);
        setIsTransitioning(false);
      }, 500);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out
            ${currentIndex === index ? "opacity-100" : "opacity-0"}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-[#0B2818]/40" />
          {banner.image ||
          banner.player.image ||
          (banner.player.favoriteTeam &&
            TEAMS_IMAGES[
              `${banner.player.favoriteTeam}Background` as keyof typeof TEAMS_IMAGES
            ]) ? (
            <div className="absolute inset-0">
              <Image
                src={
                  banner.image ||
                  banner.player.image ||
                  TEAMS_IMAGES[
                    `${banner.player.favoriteTeam}Background` as keyof typeof TEAMS_IMAGES
                  ] ||
                  ""
                }
                alt={banner.player.name}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2818]/60 via-transparent to-transparent" />
            </div>
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-r ${banner.gradientFrom} ${banner.gradientTo}`}
            />
          )}

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h2
                  className={`text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 transform transition-all duration-500
                  drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-shadow-lg
                  ${isTransitioning ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}
                >
                  {banner.title}
                </h2>
                <p
                  className={`text-lg md:text-xl text-white mb-3 md:mb-6 transform transition-all duration-500 delay-100
                  drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]
                  ${isTransitioning ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}
                >
                  {banner.subtitle}
                </p>

                {/* Don't show player name and stats if it's the last tournament winner */}
                {!banner.image ? (
                  <div
                    className={`transform transition-all duration-500 delay-200
                  ${isTransitioning ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}
                  >
                    <div className="flex flex-col">
                      <h3 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
                        {banner.player.name}
                      </h3>

                      {banner.showGoals && (
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="px-3 py-1 rounded-full">
                            <span className="text-sm md:text-base text-green-400 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                              {banner.player.goals} goles
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 
              ${
                index === currentIndex
                  ? "bg-white w-6 md:w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
