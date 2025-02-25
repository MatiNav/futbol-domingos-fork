import { NextRequest, NextResponse } from "next/server";
import { BadRequestError } from "@/app/utils/server/errors";
import { getSignedUrlProfileImage } from "../../utils/getSignedUrl";

export async function getReadSignedUrlProfileImage() {
  const url = await getSignedUrlProfileImage("read");

  return NextResponse.json({ url });
}

export async function getWriteSignedUrlProfileImage(req: NextRequest) {
  const fileType = await getFileType(req);
  const url = await getSignedUrlProfileImage("write", fileType);

  return NextResponse.json({ url });
}

async function getFileType(req?: NextRequest) {
  if (req == null) {
    throw new BadRequestError("Missing request");
  }

  const { fileType } = await req.json();
  if (fileType == null) {
    throw new BadRequestError("Missing fileType");
  }

  return fileType;
}
