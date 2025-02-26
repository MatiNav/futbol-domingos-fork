"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { isImageUrl } from "../utils/image";
import { UserProvider } from "@auth0/nextjs-auth0/client";

type AuthContextType = {
  profileImageUrl: string | null;
  isLoadingProfileImage: boolean;
  errorProfileImage: string | null;
};

const AuthContext = createContext<AuthContextType>({
  profileImageUrl: null,
  isLoadingProfileImage: true,
  errorProfileImage: null,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoadingProfileImage, setIsLoadingProfileImage] = useState(true);
  const [errorProfileImage, setErrorProfileImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getImageUrl = async () => {
      try {
        const resp = await fetch("/api/user/profile/image");

        const { url } = await resp.json();
        const isImage = await isImageUrl(url);
        setProfileImageUrl(isImage ? url : null);
        setIsLoadingProfileImage(false);
        setErrorProfileImage(null);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setErrorProfileImage(
          error instanceof Error ? error.message : "Unknown error"
        );
        setIsLoadingProfileImage(false);
      }
    };

    getImageUrl();
  }, []);

  return (
    <AuthContext.Provider
      value={{ profileImageUrl, isLoadingProfileImage, errorProfileImage }}
    >
      <UserProvider>{children}</UserProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
