import { NextRequest, NextResponse } from "next/server";
import { fetchHistoricalRates } from "@/lib/api/exchange";
import type { TimePeriod } from "@/lib/types/exchange";

const VALID_PERIODS: TimePeriod[] = ["7d", "30d", "90d", "1y"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from") ?? "USD";
  const to = searchParams.get("to") ?? "EUR";
  const period = (searchParams.get("period") ?? "30d") as TimePeriod;

  if (!VALID_PERIODS.includes(period)) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  try {
    const data = await fetchHistoricalRates(from, to, period);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch historical rates" },
      { status: 503 }
    );
  }
}
