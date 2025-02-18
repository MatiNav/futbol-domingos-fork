import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "@/app/utils/server/errors";
import { NextResponse } from "next/server";

type HandlerFunction = (
  request: Request,
  context: any
) => Promise<NextResponse>;

export function withErrorHandler(handler: HandlerFunction) {
  return async (request: Request, context: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
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
