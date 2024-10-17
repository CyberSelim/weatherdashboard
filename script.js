document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-button').addEventListener('click', handleSearch);
});

const knownCities = [
    'Amsterdam', 'Berlin', 'London', 'Paris', 'Rome', 'New York', 'Tokyo', 'Sydney'
];

function handleSearch() {
    const locationInput = document.getElementById('location-input').value.trim();
    console.log(`Locatie ingevoerd: ${locationInput}`);

    if (!isValidLocationInput(locationInput)) {
        alert('Voer een geldige locatie in.');
        return;
    }

    fetchLocationData(locationInput);
}

function isValidLocationInput(input) {
    // Valideer dat de invoer een bekende stad is
    return knownCities.includes(input);
}

function fetchLocationData(locationInput) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}`)
        .then(response => response.json())
        .then(locations => {
            console.log('Locatiegegevens:', locations);
            if (locations.length > 0) {
                const city = {
                    latitude: locations[0].lat,
                    longitude: locations[0].lon
                };
                console.log(`Gevonden coördinaten: ${city.latitude}, ${city.longitude}`);
                fetchWeatherData(city, locationInput);
            } else {
                alert('Locatie niet gevonden');
            }
        })
        .catch(error => console.error('Error fetching location data:', error));
}

function fetchWeatherData(city, locationName) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=temperature_2m`;
    console.log(`API URL: ${apiUrl}`);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Weergegevens:', data);
            const hourlyData = data.hourly.temperature_2m;
            const currentTemp = hourlyData[0];
            document.getElementById('location').textContent = locationName;
            document.getElementById('temperature').textContent = currentTemp;
        })
        .catch(error => console.error('Error fetching the weather data:', error));
}
