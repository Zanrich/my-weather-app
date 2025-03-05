import React from 'react';
import '../styles/sidebar.scss';

export interface SidebarProps {
  weatherData: {
        name: string;
        main: {
            temp: number;
            temp_min: number;
            temp_max: number;
            feels_like: number;
            humidity: number;
            pressure: number;
        };
        weather: {
            icon: string;
            description: string;
        }[];
        wind: {
            speed: number;
            deg: number;
        };
        sys: {
            country: string;
        };
    } | null;
	loading: boolean;
	error: string | null;
    darkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ weatherData, loading, error, darkMode }) => {
	if(loading){
        return(
            <div className={`weather-sidebar ${darkMode ? 'dark-mode' : ''}`}>
                <div className="loading-spinner"></div>
                <p>Loading weather data...</p>
            </div>
        )
    }

    if(error){
        return (
            <div className={`weather-sidebar ${darkMode ? 'dark-mode' : ''}`}>
              <div className="error-container">
                <h3>Error</h3>
                <p>{error}</p>
              </div>
            </div>
          );
    }

    if (!weatherData) {
        return (
            <div className={`weather-sidebar ${darkMode ? 'dark-mode' : ''}`}>
            <div className="empty-state">
              <h3>Weather Information</h3>
              <p>Click on the map to see weather details for that location.</p>
            </div>
          </div>
        );
      }
    

    const { name, main, weather, wind, sys } = weatherData;
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    
    
    return (
        <div className={`weather-sidebar ${darkMode ? 'dark-mode' : ''}`}>
          <div className="weather-header">
            <h2>
              {name}, {sys.country}
            </h2>
            <div className="weather-icon-container">
              <img
                src={weatherIcon || '/placeholder.svg'}
                alt={weather[0].description}
                className="weather-icon"
              />
              <span className="weather-description">{weather[0].description}</span>
            </div>
          </div>
    
          <div className="weather-details">
            <div className="weather-detail-item">
              <h3>Temperature</h3>
              <p className="temperature">{Math.round(main.temp)}°C</p>
              <div className="temp-minmax">
                <span>Min: {Math.round(main.temp_min)}°C</span>
                <span>Max: {Math.round(main.temp_max)}°C</span>
              </div>
            </div>
    
            <div className="weather-detail-item">
              <h3>Feels Like</h3>
              <p>{Math.round(main.feels_like)}°C</p>
            </div>
    
            <div className="weather-detail-item">
              <h3>Humidity</h3>
              <p>{main.humidity}%</p>
            </div>
    
            <div className="weather-detail-item">
              <h3>Pressure</h3>
              <p>{main.pressure} hPa</p>
            </div>
    
            <div className="weather-detail-item">
              <h3>Wind</h3>
              <p>{wind.speed} m/s</p>
              <p>Direction: {wind.deg}°</p>
            </div>
          </div>
        </div>
      );
    };
    
    export default Sidebar;