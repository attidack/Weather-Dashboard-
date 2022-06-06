const apikey = 'e6c309b8ef2a1bd7f06a69d09556f1f0'
const locationLookup = (cityName) => {
    var api = 'http://api.openweathermap.org/geo/1.0/direct?q='+ cityName + '&appid=' + apikey
    fetch(api)
    .then(function(response){
        return response.json()
        
    }).then(function(data){
        console.log(data)
        console.log(data[0].lat)
        console.log(data[0].lon)
        fetchApi(data[0].lat,data[0].lon)
    })
}

const fetchApi = (lat,lon) => {
    var oneCallApi = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&appid='+apikey+'&units=imperial'
    fetch(oneCallApi)
    .then(function(response){
        return response.json()
        
    }).then(function(data){
        console.log(data)
    })
}
$('.btn').click(function(e){
    e.preventDefault()
    var cityName = $('#City').val()
    console.log(cityName)
    locationLookup(cityName)
})















