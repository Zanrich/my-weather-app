import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherError {
    message: string;
    type: 'error';
  }

  export interface WeatherData {
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
    coord: {
      lat: number;
      lon: number;
    },
    message?: string;
    
};



export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData | null> => {

        if (!API_KEY) {
          throw new Error('API key is not configured. Please set VITE_OPENWEATHERMAP_API_KEY in your environment variables.');
        }
    
        const response = await axios.get(`${BASE_URL}/weather`, {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric',
          },
        });
    
        return response.data; 
    };

    export const getWeatherByCity = async (city: string): Promise<WeatherData | null> => {
      if (!API_KEY) {
        throw new Error(
          'API key is not configured. Please set VITE_OPENWEATHERMAP_API_KEY in your environment variables.',
        );
      }
    
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        },
      });
    
      return response.data;
    };
    