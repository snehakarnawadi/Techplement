const apiKey = `7db5fc05c8813fc632fc47d5a12e0e9a`;
// const city = "belagavi";

async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (response.status === 404) {
      throw new Error("Location not found. Please try another city.");
    }

    if (!response.ok) {
      throw new Error("Unable to fetch weather data");
    }

    const data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.error(error);
    displayErrorMessage(error.message); // Display error message to the user
    resetWeatherUI(); // Reset UI if there is an error
  }
}

const cityElement = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility-distance");

const descriptionText = document.querySelector(".description-text");
const date = document.querySelector(".date");
const descriptionIcon = document.querySelector(".description i");

// fetchWeatherData();

function displayErrorMessage(message) {
  // Assuming you have a div in your HTML with the class 'error-message'
  const errorMessageElement = document.querySelector(".error-message");
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block"; // Show the error message element
}

function resetWeatherUI() {
  cityElement.textContent = "";
  temperature.textContent = "";
  windSpeed.textContent = "";
  humidity.textContent = "";
  visibility.textContent = "";
  descriptionText.textContent = "";
  date.textContent = "";
  descriptionIcon.className = ""; // Clear previous weather icon class
}

function updateWeatherUI(data) {
  const errorMessageElement = document.querySelector(".error-message");
  if (errorMessageElement) {
    errorMessageElement.style.display = "none"; // Hide the error message
  }

  // Remove the hidden class from all components
  document
    .querySelectorAll(
      ".city-date-section, .temperature-info, .additional-info, .error-message"
    )
    .forEach(function (element) {
      element.classList.remove("hidden");
    });

  cityElement.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°`;
  windSpeed.textContent = `${data.wind.speed} km/h`;
  humidity.textContent = `${data.main.humidity}%`;
  visibility.textContent = `${data.visibility / 1000} km`;
  descriptionText.textContent = data.weather[0].description;

  const currentDate = new Date();
  date.textContent = currentDate.toDateString();
  const weatherIconName = getWeatherIconName(data.weather[0].main);
  descriptionIcon.innerHTML = `<i class="material-icons">${weatherIconName}</i>`;
}

const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".city-input");

formElement.addEventListener("submit", function (e) {
  e.preventDefault();

  const city = inputElement.value;
  if (city !== "") {
    fetchWeatherData(city);
    inputElement.value = "";
  }
});

function getWeatherIconName(weatherCondition) {
  const iconMap = {
    Clear: "wb_sunny",
    Clouds: "wb_cloudy",
    Rain: "umbrella",
    Thunderstorm: "flash_on",
    Drizzle: "grain",
    Snow: "ac_unit",
    Mist: "cloud",
    Smoke: "cloud",
    Haze: "cloud",
    Fog: "cloud",
  };

  return iconMap[weatherCondition] || "help";
}