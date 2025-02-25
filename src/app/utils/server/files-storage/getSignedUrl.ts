import storage from "./Storage";
import { GetSignedUrlConfig } from "@google-cloud/storage";

export async function getWriteSignedUrl(fileName: string, contentType: string) {
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "write",
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    contentType,
  };

  const [url] = await getSignedUrl(fileName, options);

  return url;
}

export async function getReadSignedUrl(fileName: string) {
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + 30 * 60 * 1000, // 30 minutes
  };

  const [url] = await getSignedUrl(fileName, options);

  return url;
}

function getSignedUrl(fileName: string, options: GetSignedUrlConfig) {
  const bucket = storage.bucket(
    process.env.GCP_FUTBOL_APP_BUCKET_NAME as string
  );
  const file = bucket.file(fileName);

  return file.getSignedUrl(options);
}
