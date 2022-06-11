const apikey = 'e6c309b8ef2a1bd7f06a69d09556f1f0'
const currentConditions = $('#currentConditions')
let cityName
let currentUVspan
let currentUVData

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
        var quarymonth = date.getMonth()
        var quaryYear = date.getFullYear()
        let cityNameSpan = $('<span>').text(cityName + ' (' + quarymonth + '/'+ todaysDate + '/' + quaryYear + ')')
        cityNameDiv.append(cityNameSpan)

        // weather Icon
        let iconcode = data.current.weather[0].icon
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
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
        
        // need to lookup how to do this in a for loop
        // forcast containers
        const forcastDivTitle = $('<h2>').addClass('forcast').text('5-Day Forcast:')
        const forcastContainerDiv = $('<div>').addClass('flex-row justify-space-between')
        
        // forcast day 1
        const day1 = $('<div>').addClass('forcast-card col-12 col-md-2')
        const day1Date = new Date(data.daily[0].dt * 1000)
        const day1Title = $('<div>').text(day1Date.getMonth() +'/'+ day1Date.getDay() + '/' + day1Date.getFullYear())
        
        day1.append(day1Title)
        // forcast day 2
        const day2 = $('<div>').addClass('forcast-card col-12 col-md-2')
        const day2Date = new Date(data.daily[1].dt * 1000)
        const day2Title = $('<div>').text(day2Date.getMonth() +'/'+ day2Date.getDay() + '/' + day2Date.getFullYear())
        day2.append(day2Title)

        // forcast day 3
        const day3 = $('<div>').addClass('forcast-card col-12 col-md-2')
        const day3Date = new Date(data.daily[2].dt * 1000)
        const day3Title = $('<div>').text(day3Date.getMonth() +'/'+ day3Date.getDay() + '/' + day3Date.getFullYear())
        day3.append(day3Title)

        // forcast day 4
        const day4 = $('<div>').addClass('forcast-card col-12 col-md-2')
        const day4Date = new Date(data.daily[3].dt * 1000)
        const day4Title = $('<div>').text(day4Date.getMonth() +'/'+ day4Date.getDay() + '/' + day4Date.getFullYear())
        day4.append(day4Title)

        // forcast day 5
        const day5 = $('<div>').addClass('forcast-card col-12 col-md-2')
        const day5Date = new Date(data.daily[4].dt * 1000)
        const day5Title = $('<div>').text(day5Date.getMonth() +'/'+ day5Date.getDay() + '/' + day5Date.getFullYear())
        day5.append(day5Title)


        //forcast appending
        
        forcastContainerDiv.append(day1, day2, day3, day4, day5)
        forcastDiv.append(forcastDivTitle, forcastContainerDiv)
        
       // final appending
       
        console.log(data)
        console.log()
    })
};
$('.btn').click(function(e){
    e.preventDefault()
    cityName = $('#City').val()
    

    console.log(cityName)
    locationLookup(cityName)
});