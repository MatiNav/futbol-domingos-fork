import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginContent({
  profileImageUrl,
}: {
  profileImageUrl: string | null;
}) {
  const { user, isLoading } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
      ) : user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-white hover:bg-white/10 rounded-full p-1 transition-colors"
          >
            {user.picture ? (
              <Image
                src={profileImageUrl || user.picture}
                alt={user.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Perfil
              </Link>
              <a
                href="/api/auth/logout"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </a>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/api/auth/login"
          className="flex items-center text-white hover:bg-white/10 rounded-lg px-4 py-2 transition-colors"
        >
          <span className="mr-2">Login</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
        </Link>
      )}
    </>
  );
}
