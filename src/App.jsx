import React from 'react';
import { useState } from 'react';
import './App.css';


const api = {
  key: import.meta.env.VITE_APIKEY,
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {

  const [showCard, setShowCard] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      search(e);
    }
  };

  const search = (evt, cityName) => {
    if (evt) evt.preventDefault();

    const city = cityName || query;

    if (!city.trim()) {
      setError("Please enter a city name.");
      setShowCard(false);
      return;
    }

    fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        if (result.cod !== 200) {
          setError(result.message.toUpperCase() || "Failed to fetch weather data.");
          setShowCard(false);
        } else {
          setQuery('');
          setError('');
          setShowCard(true);
          setWeather(result);
        }
      })
      .catch(err => {
        setError("An unexpected error occurred.");
        setShowCard(false);
      });
  };


  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "☀️";
      case "rain":
        return "🌧️";
      case "clouds":
        return "☁️";
      case "snow":
        return "❄️";
      default:
        return "🌈";
    }
  };

  function handleClick() {
    setShowSideBar(prev => !prev);
  }

  function addToFavorites(cityName) {
    setIsFavorite(prev => !prev);
    console.log(cityName);
    setFavorites(favorites => {
      if (favorites.includes(cityName)) {
        return favorites.filter(city => city !== cityName);
      } else {
        return [...favorites, cityName];
      }
    });
  }

  function deleteFavorite(cityName) {
    setFavorites(prevFavorites =>
      prevFavorites.filter(city => city !== cityName)
    );
  }

  const dateBuilder = (d) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;

  }



  return (
    <div className="image">

      {showSideBar && (
        <ul className={`sideBar ${showSideBar ? 'open' : ''}`}>
          {favorites.map(item => (
            <li key={item} className="favoriteItem">
              <span
                className="cityName"
                onClick={() => {
                  setQuery(item);
                  search(null, item);
                }}
                style={{ cursor: "pointer", flex: 1, textAlign: "center" }}
              >
                {item}
              </span>
              <button className="deleteFav" onClick={(e) => {
                e.stopPropagation();
                deleteFavorite(item);
              }}>X</button>
            </li>
          ))}
        </ul>
      )}

      <div className="content">
        <div className="searchContainer">
          <div className="searchBar">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="searchInput"
              placeholder="Search..."
            />
            <button className="btn" onClick={handleClick}>
              Show favorites
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </div>

        {showCard && weather && weather.weather && weather.weather[0] && (
          <div className="centerContainer">
            <div className="card">


              <button className="favorites" onClick={() => { addToFavorites(weather.name) }}>
                <img
                  src={favorites.includes(weather.name) ? "/src/assets/star-colored.png" : "/src/assets/star-blank.png"}
                  alt="Favorite"
                />
              </button>
              <button className="toggleBtn" onClick={() => setIsCelsius(prev => !prev)}>
                {isCelsius ? "°F" : "°C"}
              </button>
              <p>{dateBuilder(new Date())}</p>
              <div className="text-5xl pt-6">
                {getWeatherIcon(weather.weather[0].main)}
              </div>
              <div>
                {isCelsius
                  ? `${weather.main.temp}°C`
                  : `${(weather.main.temp * 9 / 5 + 32).toFixed(1)}°F`}
              </div>
              <div>{weather.name}, {weather.sys.country}</div>

              <div className="weatherInfo">
                <div className="flex flex-col items-center w-1/2">
                  <div className="text-xl">💧</div>
                  <div>{weather.main.humidity}%</div>
                  <div className="text-xs">Humidity</div>
                </div>
                <div className="flex flex-col items-center w-1/2">
                  <div className="text-xl">💨</div>
                  <div>{weather.wind.speed} km/h</div>
                  <div className="text-xs">Wind Speed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
