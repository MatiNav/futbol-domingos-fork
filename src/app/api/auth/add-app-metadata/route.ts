import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  console.log("req", req);
  const state = req.nextUrl.searchParams.get("state");
  //   const client = await clientPromise;
  //   const db = client.db("futbol");
  //   const playersCollection = db.collection("players");

  const isLocalhost = req.headers?.get("host")?.includes("localhost");

  const redirectUrl = isLocalhost
    ? `http://localhost:3000/api/auth/continue?state=${state}` // Dev
    : `https://futbol-gamma.vercel.app/api/auth/continue?state=${state}`; // Prod

  return NextResponse.redirect(redirectUrl);
};
