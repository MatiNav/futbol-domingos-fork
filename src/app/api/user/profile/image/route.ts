import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import getSignedUrlProfileImage from "@/app/features/profile/api/getSignedUrl";

export const POST = withApiAuthRequired(getSignedUrlProfileImage);
