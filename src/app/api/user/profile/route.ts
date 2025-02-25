import { updateProfileHandler } from "@/app/features/profile/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const dynamic = "force-dynamic";

export const PUT = withErrorHandler(updateProfileHandler);
