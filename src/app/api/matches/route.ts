import { createMatchHandler } from "@/app/features/matches/api";
import { withErrorHandler } from "@/app/utils/server/withErrorHandler";

export const dynamic = "force-dynamic";

export const POST = withErrorHandler(createMatchHandler);
