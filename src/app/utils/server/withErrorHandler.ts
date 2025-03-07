import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "@/app/utils/server/errors";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import { NextRequest, NextResponse } from "next/server";

export type RouteHandlerContext = {
  params: Record<string, string | string[]>;
};

type HandlerFunction = (
  request: NextRequest,
  context: RouteHandlerContext
) => Promise<NextResponse>;

export function withErrorHandler(handler: HandlerFunction) {
  return async (request: NextRequest, context: RouteHandlerContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error("API Error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (error instanceof BadRequestError) {
        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }

      if (error instanceof UnauthorizedError) {
        return NextResponse.json({ error: errorMessage }, { status: 401 });
      }

      if (error instanceof NotFoundError) {
        return NextResponse.json({ error: errorMessage }, { status: 404 });
      }

      // Default error response
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
