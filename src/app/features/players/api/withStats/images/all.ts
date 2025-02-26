import { getAllProfileImagesSignedUrls } from "@/app/utils/server/files-storage/getSignedUrl";
import { NextResponse } from "next/server";

export async function getAllPlayerImages() {
  const profileImagesSignedUrls = await getAllProfileImagesSignedUrls();

  return NextResponse.json(profileImagesSignedUrls);
}
