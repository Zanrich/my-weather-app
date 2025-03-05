import React, { useState, useEffect } from 'react';

import 'leaflet/dist/leaflet.css';
import './styles/App.scss';
import Sidebar from './components/sidebar';
import {
  getWeatherByCoordinates,
  WeatherData,
  getWeatherByCity,
} from './services/weatherService';
import axios from 'axios';
import SearchBar from './components/searchBar';
import DarkModeToggle from './components/darkModeToggle';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -33.9221, 18.4231,
  ]);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleLocationSelect = async (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCoordinates(lat, lng);
      if (data) {
        setWeatherData(data);
      } else {
        setError('Failed to fetch weather data');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch weather data');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(city);
      setWeatherData(data);
      if (data) {
        setSelectedLocation([data.coord.lat, data.coord.lon]);
        console.log(data.coord.lat, data.coord.lon);
        setMapCenter([data.coord.lat, data.coord.lon]);
        setMapZoom(10);
      } else {
        setError('Failed to fetch weather data');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch weather data');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        handleLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const UpdateMapView = () => {
    const map = useMap();

    useEffect(() => {
      if (mapCenter && mapZoom) {
        map.setView(L.latLng(mapCenter[0], mapCenter[1]), mapZoom);
      }
    }, [map]);

    return null;
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>Weather Map</h1>
        <div className="header-controls">
          <SearchBar onSearch={handleCitySearch} />
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
      <div className="content-container">
        <MapContainer
          className="map-container"
          center={mapCenter}
          zoom={mapZoom}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={
              darkMode
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
          />
          <UpdateMapView />
          <MapClickHandler />
          {selectedLocation && (
            <Marker position={selectedLocation}>
              <Popup>
                {weatherData ? (
                  <div>
                    <h3>{weatherData.name}</h3>
                    <p>{weatherData.weather[0].description}</p>
                    <p>{Math.round(weatherData.main.temp)}°C</p>
                  </div>
                ) : (
                  <p>Loading weather data...</p>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>

        <Sidebar
          weatherData={weatherData}
          loading={loading}
          error={error}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default App;
