import { TEAMS_IMAGES } from "../images/teams";

export type TeamOption = keyof typeof TEAMS_IMAGES;

type ErrorResponse = {
  error: string;
  status: number;
  message: string;
};

export type SuccessResponse<T> = {
  data: T;
};

export type FetchResponse<T> = SuccessResponse<T> | ErrorResponse;
