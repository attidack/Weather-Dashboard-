const apikey = 'e6c309b8ef2a1bd7f06a69d09556f1f0'
const currentConditions = $('#currentConditions')
let cityName
let currentUVspan
let currentUVData
let iconurl
let listOfCities = []


// clear page function to reset data for each search
function clearPage(){
    while (currentConditions[0].hasChildNodes()) {
        currentConditions[0].removeChild(currentConditions[0].lastChild);
    }
}


// api lookup of the city name for the longitude and latitude
const locationLookup = (cityName) => {
    var api = 'http://api.openweathermap.org/geo/1.0/direct?q='+ cityName + '&appid=' + apikey
    fetch(api)
    .then(function(response){
        return response.json()
        
    }).then(function(data){
        fetchApi(data[0].lat,data[0].lon)
    })
};
// primary function of the page, weather fetch api that will append the html structure using jquary
const fetchApi = (lat,lon) => {
    var oneCallApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&appid='+apikey+'&units=imperial'
    fetch(oneCallApi)

    // grabbing json
    .then(function(response){
        return response.json()
        
    // using the data    
    }).then(function(data){
        // clear the data for each search
        clearPage()

        // appending structure
        let currectConditionsDiv = $('<div>').addClass('border current-conditions')
        let forcastDiv = $('<div>').addClass('col-12 col-md-8')
        currentConditions.append(currectConditionsDiv, forcastDiv)
        let cityNameDiv = $('<h2>').addClass('subtitle')
        let weatherListGroup = $('<div>').addClass('list-group')
        
        let currentTemp = $('<p>').text('Temp: ' + data.current.temp)
        let currentWind = $('<p>').text('Wind Speed: ' + data.current.wind_speed + ' MPH')
        let currentHumidity = $('<p>').text('Humidity: ' + data.current.humidity + '%')
        currectConditionsDiv.append(cityNameDiv, weatherListGroup)
        

        // date from api pull
        var date = new Date(data.current.dt * 1000)
        var todaysDate = date.getDate()
        var quarymonth = date.getMonth() +1;
        var quaryYear = date.getFullYear()
        let cityNameSpan = $('<span>').text(cityName + ' (' + quarymonth + '/'+ todaysDate + '/' + quaryYear + ')')
        cityNameDiv.append(cityNameSpan)

        // weather Icon
        let iconcode = data.current.weather[0].icon
        iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        let weatherstatus = data.current.weather[0].main
        let weatherIcon = $('<img>').attr('src', iconurl).attr('alt', weatherstatus)
        cityNameSpan.append(weatherIcon)

        // UV modifiers
        let currentUV = $('<p>').text('UV Index: ')
        currentUVspan = $('<span>').text(data.current.uvi)
        currentUVData = JSON.stringify(data.current.uvi)
        function uvlookbox(currentUVspan, currentUVData){
            if (currentUVData <= 2){
                currentUVspan.addClass('uv-low')
            }else if (currentUVData > 2 && currentUVData <= 5) {
                currentUVspan.addClass('uv-moderate')
            }else if (currentUVData > 5 && currentUVData <= 7) {
                currentUVspan.addClass('uv-high')
            }else {
                currentUVspan.addClass('uv-very-high')
            };
        }uvlookbox(currentUVspan, currentUVData)
        currentUV.append(currentUVspan)
        weatherListGroup.append(currentTemp, currentWind, currentHumidity, currentUV)
                
        // 5-Day forcast
    
        // forcast containers
        const forcastDivTitle = $('<h2>').addClass('forcast').text('5-Day Forcast:')
        const forcastContainerDiv = $('<div>').addClass('flex-row justify-space-between')
        
        // forcast 5 day data loop
        for (let index = 0; index < 5; index++) {
            const element = data.daily[index];
            const day = $('<div>').addClass('forcast-card col-12 col-md-2')
            const dayDate = new Date(element.dt * 1000)
            const dayTitle = $('<div>').text((dayDate.getMonth()+1) +'/'+ dayDate.getDate() + '/' + dayDate.getFullYear())
            const dayiconcode = element.weather[0].icon
            iconurl = "http://openweathermap.org/img/w/" + dayiconcode + ".png";
            const dayWeatherIcon = $('<img>').attr('src', iconurl).attr('alt', 'weather Icon')
            let dayTemp = $('<p>').text('Temp: ' + element.temp.day)
            let dayWind = $('<p>').text('Wind: ' + element.wind_speed + ' MPH')
            let dayHumidity = $('<p>').text('Humidity: ' + element.humidity + '%')
            
            day.append(dayTitle, dayWeatherIcon, dayTemp, dayWind, dayHumidity)
            forcastContainerDiv.append(day)
            forcastDiv.append(forcastDivTitle, forcastContainerDiv)
        }

        
       
        console.log(data)
        console.log()
    })
};
// on click search for cityname
$('.btn').click(function(e){
    e.preventDefault()
    cityName = $('#City').val()
    locationLookup(cityName)
    handleSave(cityName)
});

// Save city to local host
const handleSave = (cityName) => { 
    listOfCities = listOfCities.filter(city => city.toLowerCase() !== cityName.toLowerCase()); 
    listOfCities.push(cityName.toLowerCase());
    // how this filter works
    /* let tempArray = [];
    for(let i=0; i<listOfCities.length; i++) {
        let city = listOfCities[i];
        if (city !== cityName) {
            tempArray.push(city);
        }
    }
    listOfCities = tempArray;*/
    localStorage.setItem('history', JSON.stringify(listOfCities))
};

// load saved history from localhost
const load = () => {
    let cityName = localStorage.getItem('history')
    if (!cityName) {
        listOfCities = []
    } else {
        listOfCities = JSON.parse(cityName)
    }
    console.log(cityName)
};
load()