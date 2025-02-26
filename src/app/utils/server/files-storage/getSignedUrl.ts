import storage from "./Storage";
import { GetSignedUrlConfig } from "@google-cloud/storage";

const bucket = storage.bucket(process.env.GCP_FUTBOL_APP_BUCKET_NAME as string);

const readSignedUrlOptions: GetSignedUrlConfig = {
  version: "v4",
  action: "read",
  expires: Date.now() + 30 * 60 * 1000, // 30 minutes
};

const writeSignedUrlOptions: (contentType: string) => GetSignedUrlConfig = (
  contentType: string
) => ({
  version: "v4",
  action: "write",
  expires: Date.now() + 5 * 60 * 1000, // 5 minutes
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
  const file = bucket.file(fileName);

  if (await file.exists()) {
    return file.getSignedUrl(readSignedUrlOptions);
  }

  return null;
}
function getSignedUrl(fileName: string, options: GetSignedUrlConfig) {
  const file = bucket.file(fileName);

  return file.getSignedUrl(options);
}

export async function getAllProfileImagesSignedUrls() {
  const [files] = await bucket.getFiles({
    autoPaginate: false,
    maxResults: 5,
  });

  return Object.fromEntries(
    await Promise.all(
      files.map(async (file) => {
        const displayName = decodeURIComponent(file.name.split("-")[0]);
        const [url] = await file.getSignedUrl(readSignedUrlOptions);
        return [displayName, url];
      })
    )
  );
}
