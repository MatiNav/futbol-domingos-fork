import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import {
  getProfileReadSignedUrl,
  getProfileWriteSignedUrl,
} from "@/app/features/profile/api/image";

export const POST = withApiAuthRequired(getProfileWriteSignedUrl);

export const GET = getProfileReadSignedUrl;
