import "./Reset.css";
import "./App.css";
import { useState } from "react";

import axios from "axios";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState({});
  const [mapImg, setMapImg] = useState("");
  const [weather, setWeather] = useState([]);

  function handleChange(event) {
    console.log(event.target.value);
    setSearchQuery(event.target.value);
  }

  async function getLocation() {
    try {
      const API = `https://eu1.locationiq.com/v1/search?key=${process.env.REACT_APP_API_KEY}&q=${searchQuery}&format=json`;
      const res = await axios.get(API);
      console.log(res.data[0]);
      setLocation(res.data[0]);
      getMap(res.data[0]);
      getWeather();
    } catch (error) {
      console.log(error);
      setLocation({});
      setMapImg("");
    }
  }

  function getMap(map) {
    const API = `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_API_KEY}&center=${map.lat},${map.lon}&zoom=12`;
    setMapImg(API);
  }

  async function getWeather() {
    try {
      const API = `http://localhost:8080/weather?searchQuery=${searchQuery}`;
      const res = await axios.get(API);
      console.log(res.data);
      setWeather(res.data);
    } catch (error) {
      console.log(error);
      setWeather([]);
    }
  }

  return (
    <div className="App">
      <div className="app-container container">
        <h1 className="main-heading">The City Explorer</h1>
        <input type="text" placeholder="enter location" onChange={handleChange} />
        <p>{location.display_name}</p>
        <button onClick={getLocation}>Explore</button>
        <p>
          Latitude: {location.lat} Longitude: {location.lon}
        </p>
        {mapImg && <img src={mapImg} alt={`map of ${searchQuery}`} />}
        <div>
          <h3>Weather Conditions</h3>
          {weather.map((item, idx) => {
            return (
              <p key={idx}>
                {item.date}: {item.description}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
