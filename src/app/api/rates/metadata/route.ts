import { NextRequest, NextResponse } from "next/server";
import { fetchRatesMetadata } from "@/lib/api/exchange";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const base = request.nextUrl.searchParams.get("base") ?? "USD";

  try {
    const data = await fetchRatesMetadata(base);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch rates metadata" },
      { status: 503 }
    );
  }
}
