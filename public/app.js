// Add this at the beginning of app.js
const cities = [
  "Bangalore",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Kolkata",
  "Ahmedabad",
  "Pune",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Visakhapatnam",
  "Chandigarh",
  "Coimbatore",
  "Madurai",
  "Patna",
  "New York",
  "Los Angeles",
  "San Francisco",
  "Chicago",
  "Toronto",
  "London",
  "Paris",
  "Berlin",
  "Madrid",
  "Rome",
  "Amsterdam",
  "Dubai",
  "Sydney",
  "Hong Kong",
  "Tokyo",
  "Shanghai",
  "Singapore",
  "Seoul",
  "Moscow",
  "Istanbul",
  "Bengaluru",
  "Tansen",
  "Kathmandu",
  "Pokhara",
];

// Add the showSuggestions function
function showSuggestions() {
  const input = document.getElementById("city").value.toLowerCase();
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";

  if (input.length > 0) {
    const filteredCities = cities
      .filter((city) => city.toLowerCase().startsWith(input))
      .slice(0, 5); // Show only top 5 matches

    if (filteredCities.length > 0) {
      filteredCities.forEach((city) => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fas fa-map-marker-alt"></i>${city}`;
        li.onclick = () => {
          document.getElementById("city").value = city;
          suggestions.innerHTML = "";
          // Trigger weather search
          getWeather(city, false);
          // Scroll to results
          document.querySelector(".weather-heading").scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        };
        suggestions.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.innerHTML = `<i class="fas fa-times-circle"></i>No cities found`;
      suggestions.appendChild(li);
    }
  }
}

// Add event listener for the main search input
function handleMainSearch() {
  const city = document.getElementById("mainSearch").value;
  if (city) {
    getWeather(city, false);
    // Scroll to results
    document.querySelector(".weather-heading").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    // Clear the input
    document.getElementById("mainSearch").value = "";
  }
}

// Add event listener for the submit button in the navbar
document.getElementById("submit")?.addEventListener("click", function () {
  const city = document.getElementById("city").value;
  if (city) {
    getWeather(city, false);
    document.getElementById("city").value = "";
    document.getElementById("suggestions").innerHTML = "";
  }
});

// Close suggestions when clicking outside
document.addEventListener("click", (e) => {
  const suggestions = document.getElementById("suggestions");
  const searchInput = document.getElementById("city");
  if (e.target !== searchInput) {
    suggestions.innerHTML = "";
  }
});

// Initialize the weather display
document.addEventListener("DOMContentLoaded", async () => {
  const selectedCity = sessionStorage.getItem('selectedCity');
  const shouldLoadCommonPlaces = sessionStorage.getItem('shouldLoadCommonPlaces');
  
  if (selectedCity) {
    // Clear the stored data
    sessionStorage.removeItem('selectedCity');
    sessionStorage.removeItem('shouldLoadCommonPlaces');
    
    // Get weather for the selected city
    await getWeather(selectedCity, false);
    
    // Scroll to results after a short delay
    setTimeout(() => {
      document.querySelector('.weather-heading').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 500);
  } else {
    // Show initial weather for a default city
    await getWeather('London', false);
  }
});

// Fetch weather and air quality function
const getWeather = async (city, isCommonPlace = false) => {
  try {
    if (!isCommonPlace) {
      document.getElementById('cityName').innerHTML = `Loading weather for ${city}...`;
      // Make sure main section is visible
      const mainSection = document.querySelector('main');
      if (mainSection) {
        mainSection.style.display = 'block';
        mainSection.style.opacity = '1';
        mainSection.style.transform = 'translateY(0)';
      }
    }

    // Fetch weather data
    const weatherResponse = await fetch(`/weather?city=${city}`);
    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const weatherData = await weatherResponse.json();

    if (isCommonPlace) {
      // Update common places table
      updateCommonPlaceWeather(city.toLowerCase(), weatherData);
    } else {
      // Update main weather display
      document.getElementById("cityName").innerHTML = city;

      // Update all weather data
      const updates = {
        humidity: weatherData.main.humidity,
        humidity2: weatherData.main.humidity,
        feels_like: weatherData.main.feels_like,
        temp_min: weatherData.main.temp_min,
        temp: weatherData.main.temp,
        temp2: weatherData.main.temp,
        max_temp: weatherData.main.temp_max,
        wind_speed: weatherData.wind.speed,
        wind_speed2: weatherData.wind.speed,
        wind_degrees: weatherData.wind.deg,
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(),
      };

      // Update all elements
      Object.entries(updates).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = value;
        }
      });

      // Make weather results visible
      document.querySelector("main").style.display = "block";

      // After updating main weather, also update common places
      await initializeCommonPlaces();
    }
  } catch (error) {
    console.error(error);
    if (!isCommonPlace) {
      document.getElementById(
        "cityName"
      ).innerHTML = `Error loading weather for ${city}. Please try again.`;
    }
  }
};

// Helper function to update common place weather data
function updateCommonPlaceWeather(city, weatherData) {
  const updates = {
    [`feels_like3_${city}`]: weatherData.main.feels_like,
    [`humidity3_${city}`]: weatherData.main.humidity,
    [`temp_min3_${city}`]: weatherData.main.temp_min,
    [`temp3_${city}`]: weatherData.main.temp,
    [`temp_max3_${city}`]: weatherData.main.temp_max,
    [`wind_speed3_${city}`]: weatherData.wind.speed,
    [`wind_degrees3_${city}`]: weatherData.wind.deg,
    [`sunrise3_${city}`]: new Date(
      weatherData.sys.sunrise * 1000
    ).toLocaleTimeString(),
    [`sunset3_${city}`]: new Date(
      weatherData.sys.sunset * 1000
    ).toLocaleTimeString(),
  };

  Object.entries(updates).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });
}

// Helper function to get air quality status
function getAirQualityStatus(aqi) {
  const statuses = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor",
  };
  return statuses[aqi] || "Unknown";
}

// Initialize common places weather
async function initializeCommonPlaces() {
  const commonPlaces = ["bangalore", "delhi", "lucknow", "tansen"];
  try {
    // Use Promise.all to fetch all common places weather data in parallel
    await Promise.all(commonPlaces.map(city => getWeather(city, true)));
  } catch (error) {
    console.error('Error loading common places:', error);
  }
}

// Rest of your existing code...
