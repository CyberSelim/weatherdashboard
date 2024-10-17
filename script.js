var cityInputEl = $('#city-input');
var searchBtn = $('#search-button');
var clearBtn = $('#clear-button');
var pastSearchedCitiesEl = $('#past-searches');
var currentCity;

function getWeather(data) {
    var requestUrl = `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var currentConditionsEl = $('#currentConditions');
            currentConditionsEl.addClass('border border-primary');

            var cityNameEl = $('<h2>');
            cityNameEl.text(currentCity);
            currentConditionsEl.append(cityNameEl);

            var currentDateEl = $('<span>');
            var today = new Date();
            currentDateEl.text(` (${today.toLocaleDateString()}) `);
            cityNameEl.append(currentDateEl);

            var maxTemp = data.daily.temperature_2m_max[0];
            var minTemp = data.daily.temperature_2m_min[0];
            
            var currentTempEl = $('<p>');
            currentTempEl.text(`Max Temp: ${maxTemp}°C`);
            currentConditionsEl.append(currentTempEl);
            
            var minTempEl = $('<p>');
            minTempEl.text(`Min Temp: ${minTemp}°C`);
            currentConditionsEl.append(minTempEl);
        });
    return;
}

function displaySearchHistory() {
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    var pastSearchesEl = document.getElementById('past-searches');
    pastSearchesEl.innerHTML = '';
    for (i = 0; i < storedCities.length; i++) {
        var pastCityBtn = document.createElement("button");
        pastCityBtn.classList.add("btn", "btn-primary", "my-2", "past-city");
        pastCityBtn.setAttribute("style", "width: 100%");
        pastCityBtn.textContent = `${storedCities[i].city}`;
        pastSearchesEl.appendChild(pastCityBtn);
    }
    return;
}

function getCoordinates() {
    var requestUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${currentCity}`;
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    fetch(requestUrl)
        .then(function (response) {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function (data) {
            var cityData = data[0];
            var cityInfo = {
                city: currentCity,
                latitude: cityData.lat,
                longitude: cityData.lon
            };
            storedCities.push(cityInfo);
            localStorage.setItem("cities", JSON.stringify(storedCities));
            displaySearchHistory();
            return cityInfo;
        })
        .then(function (data) {
            getWeather(data);
        });
    return;
}

function handleClearHistory(event) {
    event.preventDefault();
    var pastSearchesEl = document.getElementById('past-searches');
    localStorage.removeItem("cities");
    pastSearchesEl.innerHTML = '';
    return;
}

function clearCurrentCityWeather() {
    var currentConditionsEl = document.getElementById("currentConditions");
    currentConditionsEl.innerHTML = '';
    var fiveDayForecastHeaderEl = document.getElementById("fiveDayForecastHeader");
    fiveDayForecastHeaderEl.innerHTML = '';
    var fiveDayForecastEl = document.getElementById("fiveDayForecast");
    fiveDayForecastEl.innerHTML = '';
    return;
}

function handleCityFormSubmit(event) {
    event.preventDefault();
    currentCity = cityInputEl.val().trim();
    clearCurrentCityWeather();
    getCoordinates();
    return;
}

function getPastCity(event) {
    var element = event.target;
    if (element.matches(".past-city")) {
        currentCity = element.textContent;
        clearCurrentCityWeather();
        var requestUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${currentCity}`;
        
        fetch(requestUrl)
            .then(function (response) {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(function (data) {
                var cityData = data[0];
                var cityInfo = {
                    city: currentCity,
                    latitude: cityData.lat,
                    longitude: cityData.lon
                };
                return cityInfo;
            })
            .then(function (data) {
                getWeather(data);
            });
    }
    return;
}

displaySearchHistory();
searchBtn.on("click", handleCityFormSubmit);
clearBtn.on("click", handleClearHistory);
pastSearchedCitiesEl.on("click", getPastCity);
