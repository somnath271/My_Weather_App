// Create this new file to store the comprehensive city list
const allCities = [];

// Function to fetch cities from OpenWeatherMap API
async function loadCityList() {
    try {
        const response = await fetch('/city-list');
        const cities = await response.json();
        allCities.push(...cities);
        console.log('Cities loaded:', allCities.length);
    } catch (error) {
        console.error('Error loading cities:', error);
    }
}

// Load cities when the file is loaded
loadCityList(); 