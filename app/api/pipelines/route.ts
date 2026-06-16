import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/session";
import { hsGet } from "@/lib/hubspot";

const MOCK_PIPELINES = [
  { id: "default", label: "Pipeline Principal" },
  { id: "enterprise", label: "Enterprise" },
];

export async function GET() {
  try {
    const token = await getAccessToken();
    if (token) {
      const data = await hsGet(token, "/crm/v3/pipelines/deals");
      const pipes = (data.results || []).map((p: { id: string; label: string }) => ({
        id: p.id,
        label: p.label,
      }));
      return NextResponse.json(pipes);
    }
  } catch (e) {
    console.error("HubSpot pipelines fetch failed:", e);
  }

  return NextResponse.json(MOCK_PIPELINES);
}
