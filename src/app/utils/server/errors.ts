import "server-only";

export const CustomError = {
  BadRequest: "Bad Request",
  NotFound: "Not Found",
  Unauthorized: "Unauthorized",
  InternalServerError: "Internal Server Error",
} as const;

export class BadRequestError extends Error {
  name = CustomError.BadRequest;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  name = CustomError.NotFound;
  constructor(message: string) {
    super(message);
  }
}
export class UnauthorizedError extends Error {
  name = CustomError.Unauthorized;

  constructor(message: string) {
    super(message);
  }
}
export class InternalServerError extends Error {
  name = CustomError.InternalServerError;

  constructor(message: string) {
    super(message);
  }
}
