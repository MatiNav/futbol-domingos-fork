import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import {
  getProfileReadSignedUrl,
  getProfileWriteSignedUrl,
} from "@/app/features/profile/api/image";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const POST = withApiAuthRequired(getProfileWriteSignedUrl);

export const GET = withErrorHandler(getProfileReadSignedUrl);
