import { useState } from 'react';

import 'leaflet/dist/leaflet.css';
import './styles/App.scss';
import Sidebar from './components/sidebar';
import { getWeatherByCoordinates, WeatherData } from './services/weatherService';
import axios from 'axios';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const App:React.FC = () => {
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

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

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        handleLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };
  return (
    <>
      <div className="content-container">
      <MapContainer
        className="map-container"
        center={[0, 0]}
        zoom={2}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {selectedLocation && (
          <Marker position={selectedLocation}>
            <Popup>
                {weatherData?.name}<br /> Easily customizable.
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <Sidebar
          weatherData={weatherData}
          loading={loading}
          error={error}
        />
      </div>

     </>
  );
};

export default App;
