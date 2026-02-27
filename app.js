// ===============================
// API Configuration
// ===============================
const API_KEY = '0981a1d327c2f580624c10c4501be5e2';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ===============================
// DOM Elements
// ===============================
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

// ===============================
// Show Loading Spinner
// ===============================
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;
}

// ===============================
// Show Error Message
// ===============================
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// ===============================
// Display Weather Data
// ===============================
function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    // Focus back to input for better UX
    cityInput.focus();
}

// ===============================
// Fetch Weather (Async/Await)
// ===============================
async function getWeather(city) {

    showLoading();

    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    const startTime = Date.now(); // Track spinner start time

    try {
        const response = await axios.get(url);

        const elapsedTime = Date.now() - startTime;
        const minimumDelay = 1500; // 1.5 seconds minimum spinner
        const remainingTime = minimumDelay - elapsedTime;

        setTimeout(() => {
            displayWeather(response.data);
        }, remainingTime > 0 ? remainingTime : 0);

    } catch (error) {

        const elapsedTime = Date.now() - startTime;
        const minimumDelay = 1500;
        const remainingTime = minimumDelay - elapsedTime;

        setTimeout(() => {
            if (error.response && error.response.status === 404) {
                showError('City not found. Please check the spelling.');
            } else {
                showError('Something went wrong. Please try again later.');
            }
        }, remainingTime > 0 ? remainingTime : 0);

    } finally {
        setTimeout(() => {
            searchBtn.disabled = false;
            searchBtn.textContent = '🔍 Search';
        }, 1500);
    }
}

// ===============================
// Search Button Click Event
// ===============================
searchBtn.addEventListener('click', function () {

    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        showError('City name must be at least 2 characters.');
        return;
    }

    getWeather(city);
    cityInput.value = '';
});

// ===============================
// Enter Key Support
// ===============================
cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// ===============================
// Initial Welcome Message
// ===============================
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <p>🌍 Enter a city name to get started!</p>
    </div>
`;