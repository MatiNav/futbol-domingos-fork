import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getSignedUrlProfileImage } from "@/app/features/profile/api/image";

export const POST = withApiAuthRequired(getSignedUrlProfileImage);
