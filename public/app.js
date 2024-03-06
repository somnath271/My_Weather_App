// Fetch weather function
const getWeather = async (city) => {
  try {
    const response = await fetch(`/weather?city=${city}`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();

    console.log(data); // Log the data object to the console

    // Update weather information in the HTML
    const cityNameElement = document.querySelector("#cityName");
    cityNameElement.innerHTML = city;

    document.querySelector("#humidity").textContent = data.main.humidity;
    document.querySelector("#humidity2").textContent = data.main.humidity;
    document.querySelector("#feels_like").textContent = data.main.feels_like;
    document.querySelector("#temp_min").textContent = data.main.temp_min;
    document.querySelector("#temp").textContent = data.main.temp;
    document.querySelector("#temp2").textContent = data.main.temp;
    document.querySelector("#max_temp").textContent = data.main.temp_max;
    document.querySelector("#wind_speed").textContent = data.wind.speed;
    document.querySelector("#wind_speed2").textContent = data.wind.speed;
    document.querySelector("#wind_degrees").textContent = data.wind.deg;
    document.querySelector("#sunrise").textContent = data.sys.sunrise;
    document.querySelector("#sunset").textContent = data.sys.sunset;

    const updateElements = [
      { id: "feels_like3", property: "feels_like" },
      { id: "humidity3", property: "humidity" },
      { id: "temp_min3", property: "temp_min" },
      { id: "temp3", property: "temp" },
      { id: "temp_max3", property: "temp_max" },
      { id: "wind_speed3", property: "speed" },
      { id: "wind_degrees3", property: "deg" },
      { id: "sunrise3", property: "sunrise" },
      { id: "sunset3", property: "sunset" },
    ];

    updateElements.forEach(({ id, property }) => {
      const elementId = `${id}_${city.toLowerCase()}`;
      const element = document.getElementById(elementId);
      if (element) {
        if (property === "speed" || property === "deg") {
          element.textContent = data.wind[property];
        } else if (property === "sunrise" || property === "sunset") {
          const time = new Date(data.sys[property] * 1000);
          element.textContent = time.toLocaleTimeString();
        } else {
          element.textContent = data.main[property];
        }
      }
    });

    const cityElement = document.getElementById(city.toLowerCase());
    if (cityElement) {
      cityElement.style.display = "table-row";
    }
  } catch (error) {
    console.error(error);
  }
};

// Call the function for each default city
getWeather("Bangalore");
getWeather("Delhi");
getWeather("Lucknow");
getWeather("Tansen");

// Handle form submission to get weather data for a user-entered city
document.querySelector("#submit").addEventListener("click", async (e) => {
  e.preventDefault();
  const city = document.getElementById("city").value;
  await getWeather(city);
  document.getElementById("city").value = ""; // Clear the input field
});
