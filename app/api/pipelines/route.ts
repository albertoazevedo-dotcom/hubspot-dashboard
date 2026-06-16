import { NextResponse } from "next/server";

const pipelines = [
  { id: "default", label: "Pipeline Principal" },
  { id: "enterprise", label: "Enterprise" },
];

export async function GET() {
  return NextResponse.json(pipelines);
}
