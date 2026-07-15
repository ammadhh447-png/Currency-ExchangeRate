import { NextRequest, NextResponse } from "next/server";
import { fetchLatestRates } from "@/lib/api/exchange";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const base = request.nextUrl.searchParams.get("base") ?? "USD";

  try {
    const data = await fetchLatestRates(base, { noCache: true });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch exchange rates" },
      { status: 503 }
    );
  }
}
