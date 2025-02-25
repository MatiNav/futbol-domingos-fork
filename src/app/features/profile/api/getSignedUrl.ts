import { NextRequest, NextResponse } from "next/server";
import { BadRequestError } from "../../../utils/server/errors";
import { getAuthenticatedUser } from "../../auth/utils";
import getSignedUrl from "@/app/utils/server/files-storage/getSignedUrl";

export default async function getSignedUrlProfileImage(req: NextRequest) {
  const user = await getAuthenticatedUser();

  const { fileType } = await req.json();

  if (!fileType) {
    throw new BadRequestError("Missing fileType");
  }

  const filename = `${user?.name}-profile-${Date.now()}`;

  const url = await getSignedUrl(filename, fileType);

  return NextResponse.json({ url });
}
