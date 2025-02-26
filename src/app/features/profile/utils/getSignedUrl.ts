import { getReadSignedUrl } from "@/app/utils/server/files-storage";

import { getWriteSignedUrl } from "@/app/utils/server/files-storage";
import { getAuthenticatedUser } from "../../auth/utils";
import { UserProfileWithPlayerId } from "@/app/constants/types";

export async function getReadSignedUrlProfileImage() {
  const user = await getAuthenticatedUser();
  if (user == null) {
    return null;
  }

  const filename = getProfileImageName(user);

  return getReadSignedUrl(filename);
}

export async function getWriteSignedUrlProfileImage(fileType: string) {
  const user = await getAuthenticatedUser(true);
  const filename = getProfileImageName(user);
  return getWriteSignedUrl(filename, fileType);
}

export function getProfileImageName(user: UserProfileWithPlayerId) {
  return `${user.displayName}-profile`;
}
