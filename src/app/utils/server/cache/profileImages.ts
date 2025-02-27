import { PROFILE_IMAGE_TTL } from "../files-storage/getSignedUrl";
import redis from "@/lib/redis";

const PROFILE_IMAGES_KEY = "profile_images";

function getProfileImageUrlKey(playerDisplayName: string) {
  return `${PROFILE_IMAGES_KEY}:${playerDisplayName}`;
}

export async function getCachedProfileImagesFromAllPlayers() {
  const profileImages = await (await redis).get(PROFILE_IMAGES_KEY);
  return JSON.parse(profileImages as string) as Record<string, string>;
}

export async function setCachedProfileImagesFromAllPlayers(
  profileImages: Record<string, string>
) {
  const redisClient = await redis;
  await redisClient.set(PROFILE_IMAGES_KEY, JSON.stringify(profileImages), {
    EX: PROFILE_IMAGE_TTL - 60, // 1 minute less than the TTL
  });
}

export async function getCachedProfileImageUrl(playerDisplayName: string) {
  const redisClient = await redis;
  const url = await redisClient.get(getProfileImageUrlKey(playerDisplayName));
  return url;
}

export async function setCachedProfileImageUrl(
  playerDisplayName: string,
  url: string
) {
  const redisClient = await redis;
  await redisClient.set(getProfileImageUrlKey(playerDisplayName), url, {
    EX: PROFILE_IMAGE_TTL - 60, // 1 minute less than the TTL
  });

  await updateProfileImage(playerDisplayName, url);
}

export async function updateProfileImage(
  playerDisplayName: string,
  playerSignedUrl: string
) {
  const allPlayersImages = await getCachedProfileImagesFromAllPlayers();

  if (allPlayersImages == null) {
    return;
  }

  allPlayersImages[playerDisplayName] = playerSignedUrl;

  await setCachedProfileImagesFromAllPlayers(allPlayersImages);
}

export async function deleteProfileImage(playerDisplayName: string) {
  const redisClient = await redis;
  await redisClient.del(getProfileImageUrlKey(playerDisplayName));

  const allPlayersImages = await getCachedProfileImagesFromAllPlayers();
  delete allPlayersImages[playerDisplayName];
  await setCachedProfileImagesFromAllPlayers(allPlayersImages);
}
