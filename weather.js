import axios from 'axios'

export default function getWeather(lat, long, tz) {
  return axios
    .get(
      'https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime',
      {
        params: {
          latitude: lat,
          longitude: long,
          timezone: tz,
        },
      }
    )
    .then(({ data }) => {
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
      }
    })
}

function parseCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather

  const {
    temperature_2m_max: [highTemp],
    temperature_2m_min: [lowTemp],
    apparent_temperature_max: [highFlTemp],
    apparent_temperature_min: [lowFlTemp],
    precipitation_sum: [precip],
  } = daily

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(highTemp),
    lowTemp: Math.round(lowTemp),
    highFlTemp: Math.round(highFlTemp),
    lowFlTemp: Math.round(lowFlTemp),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
  }
}

function parseDailyWeather({ daily }) {
  return daily.time.map((time, idx) => {
    return {
      timeStamp: time * 1000,
      iconCode: daily.weathercode[idx],
      maxTemp: Math.round(daily.temperature_2m_max[idx]),
    }
  })
}

function parseHourlyWeather({ hourly, current_weather }) {
  return hourly.time
    .map((time, idx) => {
      return {
        timeStamp: time * 1000,
        iconCode: hourly.weathercode[idx],
        temp: Math.round(hourly.temperature_2m[idx]),
        flTemp: Math.round(hourly.apparent_temperature[idx]),
        wind: Math.round(hourly.windspeed_10m[idx]),
        precip: Math.round(hourly.precipitation[idx] * 100) / 100,
      }
    })
    .filter(({ timeStamp }) => timeStamp >= current_weather.time * 1000)
}
