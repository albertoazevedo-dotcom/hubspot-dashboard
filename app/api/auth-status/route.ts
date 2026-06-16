import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/session";

export async function GET() {
  const token = await getAccessToken();
  return NextResponse.json({ authenticated: !!token });
}
