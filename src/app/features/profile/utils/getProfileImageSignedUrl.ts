import { getWriteSignedUrl } from "@/app/utils/server/files-storage";
import { getAuthenticatedUser } from "../../auth/utils";
import { UserProfileWithPlayerId } from "@/app/constants/types";
import { getReadSignedUrlIfExists } from "@/app/utils/server/files-storage/getSignedUrl";
import {
  getCachedProfileImageUrl,
  deleteProfileImage,
  setCachedProfileImageUrl,
} from "@/app/utils/server/cache";

export async function getReadSignedUrlProfileImage() {
  const user = await getAuthenticatedUser();
  if (user == null) {
    return null;
  }

  const filename = getProfileImageName(user);

  const cachedUrl = await getCachedProfileImageUrl(user.displayName);

  console.log("DDD cachedUrl", cachedUrl);

  if (cachedUrl) {
    return cachedUrl;
  }

  const url = await getReadSignedUrlIfExists(filename);

  if (url) {
    await setCachedProfileImageUrl(user.displayName, url);
  }

  return url;
}

export async function getWriteSignedUrlProfileImage(fileType: string) {
  const user = await getAuthenticatedUser(true);
  const filename = getProfileImageName(user);
  const url = await getWriteSignedUrl(filename, fileType);

  // we cannot set the url to the cache here because the url has write permissions
  await deleteProfileImage(user.displayName);

  return url;
}

export function getProfileImageName(user: UserProfileWithPlayerId) {
  return `${user.displayName}-profile`;
}
