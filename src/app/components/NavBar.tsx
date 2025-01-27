import Link from "next/link";
import SoccerBall from "../assets/soccer-ball.svg";
import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="bg-[#0B2818] p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-block">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-white tracking-wider">
              D
              <span className="inline-block relative">
                <Image
                  src={SoccerBall}
                  alt="Soccer Ball"
                  width={32}
                  height={32}
                  className="inline-block transform -translate-y-1"
                />
              </span>
              mingos
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
