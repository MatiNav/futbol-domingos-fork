import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import {
  getReadSignedUrlProfileImage,
  getWriteSignedUrlProfileImage,
} from "@/app/features/profile/api/image";

export const POST = withApiAuthRequired(getWriteSignedUrlProfileImage);

export const GET = withApiAuthRequired(getReadSignedUrlProfileImage);
