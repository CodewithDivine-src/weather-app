"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const name = localStorage.getItem("userName");
    if (!loggedIn) {
      router.push("/login");
    } else {
      setUserName(name || "Guest");
    }
  }, [router]);

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/weather/current?city=${city}`);
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
      } else {
        setError(data.error || "City not found");
      }

      const forecastRes = await fetch(`/api/weather/forecast?city=${city}`);
      const forecastData = await forecastRes.json();
      if (forecastRes.ok) {
        setForecast(forecastData);
      }
    } catch (err) {
      setError("Failed to fetch weather");
    }
    setLoading(false);
  };

  const getBackgroundClass = () => {
    if (!weather) return "bg-gradient-to-br from-blue-400 to-blue-600";
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("clear")) return "bg-gradient-to-br from-yellow-400 to-orange-500";
    if (condition.includes("cloud")) return "bg-gradient-to-br from-gray-400 to-gray-700";
    if (condition.includes("rain")) return "bg-gradient-to-br from-blue-800 to-gray-900";
    if (condition.includes("snow")) return "bg-gradient-to-br from-blue-200 to-blue-400";
    return "bg-gradient-to-br from-blue-400 to-blue-600";
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!userName) return <div className="p-8 text-center">Loading...</div>;

  
  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  return (
    <div className={`min-h-screen p-8 ${getBackgroundClass()} transition-all duration-500`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {greeting}, {userName}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Check Weather</h2>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="border p-2 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchWeather}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {loading && <p className="text-center">Loading weather...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {weather && (
            <div>
              <h3 className="text-2xl font-bold">
                {weather.name}, {weather.sys?.country}
              </h3>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
                  <p className="text-gray-500 capitalize">{weather.weather[0].description}</p>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="weather icon"
                  className="w-20 h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 text-center">
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Wind Speed</p>
                  <p className="font-bold">{weather.wind.speed} m/s</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="font-bold">{weather.main.humidity}%</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Feels Like</p>
                  <p className="font-bold">{Math.round(weather.main.feels_like)}°C</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Pressure</p>
                  <p className="font-bold">{weather.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {forecast.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">5‑Day Forecast</h2>
            <div className="grid grid-cols-5 gap-2">
              {forecast.map((day, idx) => (
                <div key={idx} className="text-center">
                  <p className="font-semibold">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                    alt={day.condition}
                    className="w-12 h-12 mx-auto"
                  />
                  <p className="text-sm">{day.temp_max}° / {day.temp_min}°</p>
                  <p className="text-xs text-gray-500 capitalize">{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}