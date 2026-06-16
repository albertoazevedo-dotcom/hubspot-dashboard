import { redirect } from "next/navigation";
import { HS_AUTH_URL, SCOPES, getRedirectUri } from "@/lib/hubspot";

export async function GET() {
  const url = new URL(HS_AUTH_URL);
  url.searchParams.set("client_id", process.env.HUBSPOT_CLIENT_ID!);
  url.searchParams.set("redirect_uri", getRedirectUri());
  url.searchParams.set("scope", SCOPES);
  redirect(url.toString());
}
