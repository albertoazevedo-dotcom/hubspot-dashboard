import { NextRequest, NextResponse } from "next/server";
import { HS_TOKEN_URL, getRedirectUri } from "@/lib/hubspot";
import { saveTokens } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/?error=" + (error || "no_code"), request.url));
  }

  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.HUBSPOT_CLIENT_ID!,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
      redirect_uri: getRedirectUri(),
      code,
    });

    const res = await fetch(HS_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.redirect(new URL("/?error=token_exchange", request.url));
    }

    const data = await res.json();
    await saveTokens(data);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch {
    return NextResponse.redirect(new URL("/?error=server_error", request.url));
  }
}
