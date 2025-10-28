const express = require('express');
const router = express.Router();

// Sample weather data for different cities
const weatherDatabase = {
  'paris': {
    city: 'Paris',
    country: 'France',
    temperature: 18,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    icon: 'fas fa-cloud-sun',
    forecast: [
      { day: 'Today', high: 20, low: 15, condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' },
      { day: 'Tomorrow', high: 22, low: 16, condition: 'Sunny', icon: 'fas fa-sun' },
      { day: 'Day 3', high: 19, low: 14, condition: 'Rainy', icon: 'fas fa-cloud-rain' },
      { day: 'Day 4', high: 21, low: 17, condition: 'Sunny', icon: 'fas fa-sun' },
      { day: 'Day 5', high: 23, low: 18, condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' }
    ]
  },
  'tokyo': {
    city: 'Tokyo',
    country: 'Japan',
    temperature: 25,
    condition: 'Sunny',
    humidity: 70,
    windSpeed: 8,
    icon: 'fas fa-sun',
    forecast: [
      { day: 'Today', high: 27, low: 22, condition: 'Sunny', icon: 'fas fa-sun' },
      { day: 'Tomorrow', high: 26, low: 21, condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' },
      { day: 'Day 3', high: 24, low: 19, condition: 'Rainy', icon: 'fas fa-cloud-rain' },
      { day: 'Day 4', high: 25, low: 20, condition: 'Cloudy', icon: 'fas fa-cloud' },
      { day: 'Day 5', high: 28, low: 23, condition: 'Sunny', icon: 'fas fa-sun' }
    ]
  },
  'new york': {
    city: 'New York',
    country: 'United States',
    temperature: 22,
    condition: 'Cloudy',
    humidity: 60,
    windSpeed: 15,
    icon: 'fas fa-cloud',
    forecast: [
      { day: 'Today', high: 24, low: 18, condition: 'Cloudy', icon: 'fas fa-cloud' },
      { day: 'Tomorrow', high: 26, low: 20, condition: 'Sunny', icon: 'fas fa-sun' },
      { day: 'Day 3', high: 23, low: 17, condition: 'Rainy', icon: 'fas fa-cloud-rain' },
      { day: 'Day 4', high: 25, low: 19, condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' },
      { day: 'Day 5', high: 27, low: 21, condition: 'Sunny', icon: 'fas fa-sun' }
    ]
  },
  'london': {
    city: 'London',
    country: 'United Kingdom',
    temperature: 16,
    condition: 'Rainy',
    humidity: 80,
    windSpeed: 18,
    icon: 'fas fa-cloud-rain',
    forecast: [
      { day: 'Today', high: 18, low: 12, condition: 'Rainy', icon: 'fas fa-cloud-rain' },
      { day: 'Tomorrow', high: 17, low: 11, condition: 'Cloudy', icon: 'fas fa-cloud' },
      { day: 'Day 3', high: 19, low: 13, condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun' },
      { day: 'Day 4', high: 20, low: 14, condition: 'Sunny', icon: 'fas fa-sun' },
      { day: 'Day 5', high: 16, low: 10, condition: 'Rainy', icon: 'fas fa-cloud-rain' }
    ]
  }
};

// GET /api/weather - Get weather information for a city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      // Return available cities if no city specified
      const cities = Object.keys(weatherDatabase).map(key => ({
        key,
        name: weatherDatabase[key].city,
        country: weatherDatabase[key].country
      }));
      
      return res.json({
        message: 'Weather API is working',
        availableCities: cities
      });
    }
    
    const cityKey = city.toLowerCase();
    const weather = weatherDatabase[cityKey];
    
    if (!weather) {
      // Return mock data for unknown cities
      const mockWeather = {
        city: city,
        country: 'Unknown',
        temperature: Math.floor(Math.random() * 30) + 5,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        icon: 'fas fa-cloud-sun',
        forecast: []
      };
      return res.json(mockWeather);
    }
    
    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

module.exports = router;
