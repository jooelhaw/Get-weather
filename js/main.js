let searchBtn = document.getElementById('searchBtn');
let searchInput = document.getElementById('searchInput');
let searchForm = document.querySelector('form.find-location');
let searchResult = document.getElementById('searchResult');
let todayTemp = document.querySelector('.forecast-content .num');
let foreCastDays = document.querySelectorAll('.today.forecast');
let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"];
let yearMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function handleResultClick() {
  let searchItems = document.querySelectorAll('.searchResult button');
  for (let i = 0; i < searchItems.length; i++) {
    searchItems[i].addEventListener('click', function (e) {
      getData(q = searchItems[i].textContent);
      searchInput.value = searchItems[i].textContent;
      searchResult.classList.replace('d-flex', 'd-none');
    })
  }

}

// when click on find button
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  getData(searchInput.value);
})

// when type the city name view the search results
searchInput.addEventListener('input', function (e) {
  searchResult.classList.replace('d-none', 'd-flex');
  searchCity(searchInput.value);

})


async function getData(lat = "", long = "", q = `${lat},${long}`) {
  //So to get current weather for London: JSON: http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London
  //!898cb6e16b794afaa1f220142240612

  try {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=898cb6e16b794afaa1f220142240612&q=${q}&days=3`);

    if (!(response.ok == true)) {
      let responseData = await response.json();
      throw new Error('There is a problem in the response');
    }
    let responseData = await response.json();

    getAllDaysData(responseData);
  } catch (err) {
    console.log(err);
  }
}

async function searchCity(params) {
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/search.json?key=898cb6e16b794afaa1f220142240612&q=${params}`);
    if (response.ok) {
      let data = await response.json();
      let aData = Array.from(data);
      if (aData.length > 0) {
        var result = aData.reduce((pre, current) =>
          pre += `
        <hr>
        <button class="mb-0 m-auto pb-0"><span class="cityResult">${current.name}</span> , <span class="countryResult">${current.country}</span></button>
        <hr>`
          , ``);
        searchResult.innerHTML = result;
        handleResultClick();
      }
    } else {
      throw new Error('There is a problem in response')
    }

  } catch (err) {
    console.log(err);
    searchResult.innerHTML = 'There is a problem no data founded';
  }
}


function getAllDaysData(data) {
  // get today data 
  let currentDayDate = new Date(data.forecast.forecastday[0].date);
  todayTemp.innerHTML = `<div class="num">${data.current.temp_c}<sup>o</sup>C</div>`
  foreCastDays.item(0).innerHTML = `
  <div class="forecast-header">
							<div class="day">${weekDays[currentDayDate.getDay()]}</div>
							<div class="date">${currentDayDate.getDate()} ${yearMonth[currentDayDate.getMonth()]}</div>
						</div> <!-- .forecast-header -->
						<div class="forecast-content">
							<div class="location">${data.location.name}, <span class="fs-6 fw-lighter">${data.location.country}</span></div>
							<div class="degree">
								<div class="num">${data.current.temp_c}<sup>o</sup>C</div>
								<div class="forecast-icon">
									<img src="${data.forecast.forecastday[0].day.condition.icon}" alt="atmo shape" width=90>
								</div>
                <div class="forecast-condition">
									<span class="text-primary">${data.current.condition.text}</span>
								</div>
							</div>
							<span><img src="images/icon-umberella.png" alt="icon-umberella">${data.current.cloud}%</span>
							<span><img src="images/icon-wind.png" alt="icon-wind">${data.current.wind_kph}km/h</span>
							<span><img src="images/icon-compass.png" alt="icon-compass">${data.current.wind_dir}</span>
						</div>`
  getDaysTemp(data);
}

function getDaysTemp(data) {
  for (let i = 1; i < foreCastDays.length; i++) {
    foreCastDays[i].innerHTML = `						
    <div class="forecast-header">
							<div class="day text-center">${weekDays[new Date(data.forecast.forecastday[i].date).getDay()]}</div>
						</div> <!-- .forecast-header -->
						<div class="forecast-content">
							<div class="forecast-icon">
								<img src="${data.forecast.forecastday[i].day.condition.icon}" alt="atmo shape" width=48>
							</div>
							<div class="degree">${data.forecast.forecastday[i].day.maxtemp_c}<sup>o</sup>C</div>
              <small>${data.forecast.forecastday[i].day.mintemp_c}<sup>o</sup></small>
              <div>
									<span class="text-primary forecast-condition">${data.forecast.forecastday[i].day.condition.text}</span>
							</div>
		</div>`;
  }
}


function getWeatherByLocation() {
  let currentLocation = [];
  const successCallback = (position) => {
    currentLocation = [position.coords.latitude, position.coords.longitude];
    getData(lat = currentLocation[0], long = currentLocation[1]);
  };
  const errorCallback = (error) => {
    currentLocation = [30.033333, 31.233334];
    getData(lat = currentLocation[0], long = currentLocation[1]);
  };
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

getWeatherByLocation();