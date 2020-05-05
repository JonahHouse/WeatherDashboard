// GIVEN a weather dashboard with form inputs


// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history


// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index


// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe


// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

let cityState;
document.getElementById('searchCity').addEventListener('click', function(){
cityState = document.getElementById('cityState').value;



// City to Lat , Long
    var apikey = '0b09f880c3544ef8a5e7f8c032a4dd5e';
    // var cityState = "irvine, california"

    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
    + '?'
    + 'key=' + apikey
    + '&q=' + encodeURIComponent(cityState)
    + '&pretty=1'
    + '&no_annotations=1';


// Save searches on page for future use
    
    localStorage.setItem(localStorage.length, cityState)

    for (i = 0; i < localStorage.length; i++) {
        let pastSearchList = document.getElementById('pastSearches');
        let createPastSearch = document.createElement('A');
        createPastSearch.classList = 'list-group-item list-group-item-action bg-light';
        createPastSearch.textContent = localStorage.getItem(i);
        pastSearchList.appendChild(createPastSearch);
    }

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);

    request.onload = function() {

    if (request.status == 200){ 
        // Success!
        var data = JSON.parse(request.responseText);
        let lat = data.results[0].geometry.lat;
        let lng = data.results[0].geometry.lng;

        // Pull lat and long for weather API
        lat = lat.toFixed(2)
        lng = lng.toFixed(2)

        
        // Change Header
        document.getElementById('dashboardTitle').textContent = data.results[0].formatted + ' | 5 Day Weather Forecast';

    // Lat, Long to forcast
        let forcast_URL

        var apiForecast_url = 'https://api.openweathermap.org/data/2.5/onecall?'
    
        var requestForecast_url = apiForecast_url
        + 'lat=' + lat
        + '&lon=' + lng
        + '&units=imperial&exclude=hourly&appid=02bdf97012ff44587a2c642caf8d0f96'

        fetch(requestForecast_url)
        .then(response => response.json())
        .then( weatherData => {
    

    // Current Weather
    // 5 day Forecast
        for (i = 0; i <= 5; i++) {

        // Description 
        console.log(weatherData);
        document.getElementById(`description${i}`).textContent = "Weather: " + weatherData.daily[i].weather[0].main;
        
        // Icon 
        let iconURL = `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png`
        console.log(iconURL)
        document.getElementById(`img${i}`).src = iconURL;

        // Temp
        let temp = (weatherData.daily[i].temp.day).toFixed();
        document.getElementById(`temp${i}`).textContent = "Tempature " + temp + " degrees F";

        // Humidity
        let humid = (weatherData.daily[i].humidity);
        document.getElementById(`humid${i}`).textContent = "Humidity " + humid;

        // UV Index
        let uvi = (weatherData.daily[i].uvi);
        document.getElementById(`uv${i}`).textContent = "UV Index " + uvi;

        // Date
        let lameDate = (weatherData.daily[i].dt);
        let date = new Date(lameDate * 1000).toLocaleDateString("en-US")
        document.getElementById(`date${i}`).textContent = date;
        
        };


        })} else if (request.status <= 500){ 
        // We reached our target server, but it returned an error
                             
        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log(data.status.message);
      } else {
        console.log("server error");
      }
    };
  
    request.onerror = function() {
      // There was a connection error of some sort
      console.log("unable to connect to server");        
    };
  
    request.send();  // make the request
                            

})




