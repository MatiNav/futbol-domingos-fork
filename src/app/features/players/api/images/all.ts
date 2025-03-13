import { getAllProfileImagesSignedUrls } from "@/app/utils/server/files-storage/getSignedUrl";
import {
  getCachedProfileImagesFromAllPlayers,
  setCachedProfileImagesFromAllPlayers,
} from "@/app/utils/server/cache";
import { NextResponse } from "next/server";

export async function getAllPlayersImages() {
  const cachedSignedUrlsFromAllPlayers =
    await getCachedProfileImagesFromAllPlayers();

  if (cachedSignedUrlsFromAllPlayers) {
    return NextResponse.json(cachedSignedUrlsFromAllPlayers);
  }

  const profileImagesSignedUrls = await getAllProfileImagesSignedUrls();

  await setCachedProfileImagesFromAllPlayers(profileImagesSignedUrls);

  return NextResponse.json(profileImagesSignedUrls);
}
