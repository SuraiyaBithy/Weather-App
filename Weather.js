const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", function () {
  const city = cityInput.value.trim();
  if (city === "") {
    weatherResult.textContent = "Please enter a city name!";
    return;
  }
  weatherResult.textContent = "Loading weather data....";
  cityInput.value = "";
  searchBtn.disabled = true;
  searchBtn.textContent = "LOADING";
  getCityCoordinates(city);
});
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});
async function getCityCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch city data");
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      weatherResult.textContent = "City not found!";
      return;
    }
    const location = data.results[0];
    const latitude = location.latitude;
    const longitude = location.longitude;
    console.log(latitude, longitude);
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const weatherData = await weatherResponse.json();

    console.log(weatherData);
    const currentWeather = weatherData.current;

    const temperature = currentWeather.temperature_2m;
    const humidity = currentWeather.relative_humidity_2m;
    const windSpeed = currentWeather.wind_speed_10m;
    const weatherCode = currentWeather.weather_code;
    const condition = getWeatherCondition(weatherCode);
    console.log(condition);

    console.log(temperature);
    console.log(humidity);
    console.log(windSpeed);
    console.log(weatherCode);
    weatherResult.innerHTML = `
  <h2>${location.name}, ${location.country}</h2>
  <h3>${temperature}°C</h3>
  <p>Condition: ${condition}</p>
  <p>Humidity: ${humidity}%</p>
  <p>Wind Speed: ${windSpeed} km/h</p>
`;
  } catch (error) {
    weatherResult.textContent = "Something went wrong!";
    console.log(error);
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}
function getWeatherCondition(code) {
  if (code === 0) {
    return "Clear Sky ☀️";
  } else if (code >= 1 && code <= 3) {
    return "Partly Cloudy ☁️";
  } else if (code === 45 || code === 48) {
    return "Foggy 🌫️";
  } else if (code >= 51 && code <= 55) {
    return "Drizzle 🌦️";
  } else if (code >= 61 && code <= 65) {
    return "Rainy 🌧️";
  } else if (code >= 71 && code <= 75) {
    return "Snowy ❄️";
  } else if (code >= 80 && code <= 82) {
    return "Rain Showers 🌧️";
  } else if (code >= 95 && code <= 99) {
    return "Thunderstorm ⛈️";
  } else {
    return "Unknown Weather";
  }
}
