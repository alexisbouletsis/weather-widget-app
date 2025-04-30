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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      search(e);
    }
  };

  const search = evt => {

    if (evt) evt.preventDefault(); // Prevents default behavior



    // if (!query.trim()) {
    //   console.log("Please enter a city name.");
    //   return;
    // }
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setQuery('');
        console.log(result);
        setShowCard(true);
        setWeather(result);
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


  return (
    <div className="image">

      {showSideBar && (
        <ul className={`sideBar ${showSideBar ? 'open' : ''}`}>
          {favorites.map(item => (
            <li key={item} className="favoriteItem">
              {item}
              <button className="deleteFav" onClick={() => deleteFavorite(item)}>X</button>
            </li>
          ))}
        </ul>
      )}

      <div className="content">
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

        {showCard && (
          <div className="centerContainer">
            <div className="card">

              <button className="favorites" onClick={() => { addToFavorites(weather.name) }}>
                <img
                  src={favorites.includes(weather.name) ? "/src/assets/star-colored.png" : "/src/assets/star-blank.png"}
                  alt="Favorite"
                />
              </button>

              <div className="text-5xl pt-6">
                {getWeatherIcon(weather.weather[0].main)}
              </div>
              <div>{weather.main.temp}°C</div>
              <div className="location">{weather.name}, {weather.sys.country}</div>

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
