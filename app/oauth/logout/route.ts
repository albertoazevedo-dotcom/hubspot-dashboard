import { NextResponse, type NextRequest } from "next/server";
import { clearTokens } from "@/lib/session";

export async function GET(req: NextRequest) {
  await clearTokens();
  const base = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
  return NextResponse.redirect(new URL("/", base));
}
