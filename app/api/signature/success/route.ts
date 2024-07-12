import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { signature } = body;
  // do something with the signature
  return NextResponse.json({ message: "ok" });
};
