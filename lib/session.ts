import { cookies } from "next/headers";
import { HS_TOKEN_URL, getRedirectUri } from "./hubspot";

const COOKIE_ACCESS  = "hs_access_token";
const COOKIE_REFRESH = "hs_refresh_token";
const COOKIE_EXPIRES = "hs_expires_at";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const token   = jar.get(COOKIE_ACCESS)?.value;
  const refresh = jar.get(COOKIE_REFRESH)?.value;
  const exp     = Number(jar.get(COOKIE_EXPIRES)?.value || 0);

  if (!token) return null;

  // Refresh if within 2 minutes of expiry
  if (refresh && Date.now() > exp - 120_000) {
    try {
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.HUBSPOT_CLIENT_ID!,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
        redirect_uri: getRedirectUri(),
        refresh_token: refresh,
      });
      const res = await fetch(HS_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = await res.json();
      if (data.access_token) {
        jar.set(COOKIE_ACCESS,  data.access_token,  { ...COOKIE_OPTS, maxAge: data.expires_in });
        jar.set(COOKIE_REFRESH, data.refresh_token, { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 * 30 });
        jar.set(COOKIE_EXPIRES, String(Date.now() + data.expires_in * 1000), COOKIE_OPTS);
        return data.access_token;
      }
    } catch { /* fall through, return existing token */ }
  }

  return token;
}

export async function saveTokens(data: { access_token: string; refresh_token: string; expires_in: number }) {
  const jar = await cookies();
  jar.set(COOKIE_ACCESS,  data.access_token,  { ...COOKIE_OPTS, maxAge: data.expires_in });
  jar.set(COOKIE_REFRESH, data.refresh_token, { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 * 30 });
  jar.set(COOKIE_EXPIRES, String(Date.now() + data.expires_in * 1000), COOKIE_OPTS);
}

export async function clearTokens() {
  const jar = await cookies();
  jar.delete(COOKIE_ACCESS);
  jar.delete(COOKIE_REFRESH);
  jar.delete(COOKIE_EXPIRES);
}
