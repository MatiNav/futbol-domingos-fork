import { BadRequestError } from "@/app/utils/server/errors";
import { NextRequest } from "next/server";

// First overload: when params with opinionId is provided
export async function getOpinionParams(
  request: NextRequest,
  params: { opinionId?: string }
): Promise<{ content: string; opinionId?: string }>;

// Second overload: when params is optional/undefined
export async function getOpinionParams(
  request: NextRequest,
  params?: undefined
): Promise<{ content: string }>;

export async function getOpinionParams(
  request: NextRequest,
  params?: { opinionId?: string }
): Promise<{ content: string } | { content: string; opinionId: string }> {
  const { content } = await request.json();

  if (!content?.trim()) {
    throw new BadRequestError("Opinion content is required");
  }

  if (content.trim().length > 1000) {
    throw new BadRequestError("Opinion must be 1000 characters or less");
  }

  return { content, ...(params?.opinionId && { opinionId: params.opinionId }) };
}
