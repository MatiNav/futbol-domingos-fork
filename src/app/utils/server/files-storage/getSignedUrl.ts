import storage from "./Storage";
import { GetSignedUrlConfig } from "@google-cloud/storage";

export default async function getSignedUrl(fileName: string, fileType: string) {
  const bucket = storage.bucket(
    process.env.GCP_FUTBOL_APP_BUCKET_NAME as string
  );
  const file = bucket.file(encodeURIComponent(fileName));

  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "write",
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    contentType: fileType,
  };

  const [url] = await file.getSignedUrl(options);

  return url;
}
