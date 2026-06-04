import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather error:", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}