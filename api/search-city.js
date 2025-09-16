export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q: query } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).json({
      error: "Query parameter is required and must be at least 2 characters",
    });
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      query
    )}&limit=5&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    // Format the response
    const formattedCities = data.map((city) => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
    }));

    // Cache suggestions briefly to speed up typing
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=30");
    res.status(200).json(formattedCities);
  } catch (error) {
    console.error("Geocoding API error:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
}
