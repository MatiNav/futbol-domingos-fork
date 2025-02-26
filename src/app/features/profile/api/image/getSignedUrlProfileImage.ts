import { NextRequest, NextResponse } from "next/server";
import { BadRequestError } from "@/app/utils/server/errors";
import {
  getReadSignedUrlProfileImage,
  getWriteSignedUrlProfileImage,
} from "../../utils/getSignedUrl";

export async function getProfileReadSignedUrl() {
  const url = await getReadSignedUrlProfileImage();

  return NextResponse.json({ url });
}

export async function getProfileWriteSignedUrl(req: NextRequest) {
  const fileType = await getFileType(req);
  const url = await getWriteSignedUrlProfileImage(fileType);

  return NextResponse.json({ url });
}

async function getFileType(req: NextRequest) {
  const { fileType } = await req.json();

  if (fileType == null) {
    throw new BadRequestError("Missing fileType");
  }

  return fileType;
}
