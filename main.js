import './style.css'
import getWeather from './weather'

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
  .then(renderWeather)
  .catch((err) => {
    console.error(err)
    alert('Error retrieving weather data.')
  })

function renderWeather({ current, daily, hourly }) {
  renderCurrent(current)
  renderDaily(daily)
  renderHourly(hourly)
  document.body.classList.remove('blurred')
}

function renderCurrent(current) {}
function renderDaily(daily) {}
function renderHourly(hourly) {}
