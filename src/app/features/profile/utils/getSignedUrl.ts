import { getReadSignedUrl } from "@/app/utils/server/files-storage";

import { getWriteSignedUrl } from "@/app/utils/server/files-storage";
import { getAuthenticatedUser } from "../../auth/utils";

export async function getSignedUrlProfileImage(
  action: "read" | "write",
  fileType?: string
) {
  const user = await getAuthenticatedUser(true);
  const filename = `${user.name}-profile`;

  if (action === "read") {
    return await getReadSignedUrl(filename);
  }

  if (fileType == null) {
    throw new Error("Missing fileType");
  }

  return await getWriteSignedUrl(filename, fileType);
}
