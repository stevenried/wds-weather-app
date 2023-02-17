import './style.css'
import getWeather from './weather'
import { ICON_MAP } from './iconMap'

navigator.geolocation.getCurrentPosition(positionSuccess, positionFail)

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch((err) => {
      console.error(err)
      alert('Error retrieving weather data.')
    })
}

function positionFail() {
  alert(
    'Error retrieving location. Please allow us to use your location, and refresh the page.'
  )
}

function renderWeather({ current, daily, hourly }) {
  renderCurrent(current)
  renderDaily(daily)
  renderHourly(hourly)
  document.body.classList.remove('blurred')
}

const currentIcon = document.querySelector('[data-current-icon')

function renderCurrent(current) {
  currentIcon.src = getIconURL(current.iconCode)
  setValue('current-temp', current.currentTemp)
  setValue('current-high', current.highTemp)
  setValue('current-low', current.lowTemp)
  setValue('current-fl_high', current.highFlTemp)
  setValue('current-fl_low', current.lowFlTemp)
  setValue('current-wind', current.windSpeed)
  setValue('current-precip', current.precip)
}

const dailySection = document.querySelector('[data-day-section]')
const dayCardTemplate = document.querySelector('#day-card-template')
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: 'long' })

function renderDaily(daily) {
  dailySection.innerHTML = ''
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true)
    setValue('temp', day.maxTemp, { parent: element })
    setValue('day', DAY_FORMATTER.format(day.timeStamp), { parent: element })
    element.querySelector('[data-icon]').src = getIconURL(day.iconCode)
    dailySection.append(element)
  })
}

const hourlySection = document.querySelector('[data-hour-section]')
const hourRowTemplate = document.querySelector('#hour-row-template')
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: 'numeric' })

function renderHourly(hourly) {
  hourlySection.innerHTML = ''
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true)
    setValue('day', DAY_FORMATTER.format(hour.timeStamp), { parent: element })
    setValue('time', HOUR_FORMATTER.format(hour.timeStamp), { parent: element })
    setValue('temp', hour.temp, { parent: element })
    setValue('FL_temp', hour.flTemp, { parent: element })
    setValue('wind', hour.wind, { parent: element })
    setValue('precip', hour.precip, { parent: element })
    element.querySelector('[data-icon]').src = getIconURL(hour.iconCode)
    hourlySection.append(element)
  })
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).innerText = value
}

function getIconURL(code) {
  return `./icons/${ICON_MAP.get(code)}.svg`
}
