import getStorage from "./Storage";
import { GetSignedUrlConfig } from "@google-cloud/storage";

export const PROFILE_IMAGE_TTL = 60 * 60 * 24 * 6; // 6 days

const bucket = async () => {
  console.log("DDD bucket", process.env.GCP_FUTBOL_APP_BUCKET_NAME);
  return (await getStorage()).bucket(
    process.env.GCP_FUTBOL_APP_BUCKET_NAME as string
  );
};

const readSignedUrlOptions: GetSignedUrlConfig = {
  version: "v4",
  action: "read",
  expires: new Date(Date.now() + PROFILE_IMAGE_TTL * 1000), // Convert seconds to ms for Date
};

const writeSignedUrlOptions: (contentType: string) => GetSignedUrlConfig = (
  contentType: string
) => ({
  version: "v4",
  action: "write",
  expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  contentType,
});

export async function getWriteSignedUrl(fileName: string, contentType: string) {
  const [url] = await getSignedUrl(
    fileName,
    writeSignedUrlOptions(contentType)
  );

  return url;
}

export async function getReadSignedUrl(fileName: string) {
  const [url] = await getSignedUrl(fileName, readSignedUrlOptions);

  return url;
}

export async function getReadSignedUrlIfExists(fileName: string) {
  console.log("DDD getReadSignedUrlIfExists", fileName);

  const file = (await bucket()).file(fileName);

  if (await file.exists()) {
    console.log("DDD file exists", fileName);
    const [url] = await file.getSignedUrl(readSignedUrlOptions);
    return url;
  }

  console.log("DDD file does not exist", fileName);
  return null;
}

async function getSignedUrl(fileName: string, options: GetSignedUrlConfig) {
  const file = (await bucket()).file(fileName);

  return file.getSignedUrl(options);
}

export async function getAllProfileImagesSignedUrls() {
  const [files] = await (await bucket()).getFiles({ maxResults: 100 });

  const signedUrlsFromAllPlayers = Object.fromEntries(
    await Promise.all(
      files.map(async (file) => {
        const displayName = decodeURIComponent(file.name.split("-")[0]);
        const [url] = await file.getSignedUrl(readSignedUrlOptions);
        return [displayName, url];
      })
    )
  );

  return signedUrlsFromAllPlayers;
}
