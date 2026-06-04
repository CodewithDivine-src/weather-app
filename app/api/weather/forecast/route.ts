import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City required" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message }, { status: res.status });
    }

    const daily = data.list.filter((item: any) => item.dt_txt.includes("12:00:00"));
    const fiveDay = daily.slice(0, 5).map((day: any) => ({
      date: day.dt_txt.split(" ")[0],
      temp_max: Math.round(day.main.temp_max),
      temp_min: Math.round(day.main.temp_min),
      condition: day.weather[0].main,
      icon: day.weather[0].icon,
      description: day.weather[0].description,
    }));

    return NextResponse.json(fiveDay);
  } catch (error) {
    console.error("Forecast error:", error);
    return NextResponse.json({ error: "Failed to fetch forecast" }, { status: 500 });
  }
}
