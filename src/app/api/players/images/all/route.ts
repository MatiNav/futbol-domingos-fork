import { getAllPlayerImages } from "@/app/features/players/api/withStats/images/all";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const GET = withErrorHandler(getAllPlayerImages);
