const express = require('express');
const router = express.Router();

// Sample destinations data
const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    region: "europe",
    description: "The City of Light with iconic landmarks like the Eiffel Tower and Louvre Museum.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    bestTime: "April to June, September to October",
    currency: "EUR",
    language: "French",
    seasonTips: "Spring and fall offer mild weather and fewer crowds; summer can be hot and busy."
  },
  {
    id: 2,
    name: "Tokyo",
    country: "Japan",
    region: "asia",
    description: "A vibrant metropolis blending ultramodern and traditional aspects of Japanese culture.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80",
    bestTime: "March to May, September to November",
    currency: "JPY",
    language: "Japanese",
    seasonTips: "Cherry blossom (late Mar–Apr) and autumn foliage (Nov) are peak; summer is humid."
  },
  {
    id: 3,
    name: "New York",
    country: "United States",
    region: "americas",
    description: "The Big Apple featuring iconic skyscrapers, Broadway shows, and Central Park.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    bestTime: "April to June, September to November",
    currency: "USD",
    language: "English",
    seasonTips: "Spring and fall are comfortable; winters are cold with potential snow."
  },
  {
    id: 4,
    name: "Cape Town",
    country: "South Africa",
    region: "africa",
    description: "A stunning coastal city with Table Mountain and diverse cultural experiences.",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
    bestTime: "November to March",
    currency: "ZAR",
    language: "English, Afrikaans",
    seasonTips: "Summer (Nov–Mar) is warm and dry; winter can be wet and windy."
  },
  {
    id: 5,
    name: "Sydney",
    country: "Australia",
    region: "oceania",
    description: "Famous for its Opera House, harbor, and beautiful beaches.",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
    bestTime: "September to November, March to May",
    currency: "AUD",
    language: "English",
    seasonTips: "Shoulder seasons have pleasant temps; summers are hot and popular."
  },
  {
    id: 6,
    name: "Rome",
    country: "Italy",
    region: "europe",
    description: "The Eternal City with ancient ruins, Vatican City, and delicious cuisine.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    bestTime: "April to June, September to October",
    currency: "EUR",
    language: "Italian",
    seasonTips: "Spring and fall are ideal; summers are hot and crowded."
  },
  {
    id: 7,
    name: "Bali",
    country: "Indonesia",
    region: "asia",
    description: "Tropical paradise with beautiful beaches, temples, and rich cultural heritage.",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80",
    bestTime: "April to October",
    currency: "IDR",
    language: "Indonesian, Balinese",
    seasonTips: "Dry season (Apr–Oct) is best; wet season brings afternoon showers."
  },
  {
    id: 8,
    name: "London",
    country: "United Kingdom",
    region: "europe",
    description: "Historic city with royal palaces, world-class museums, and vibrant culture.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    bestTime: "May to September",
    currency: "GBP",
    language: "English",
    seasonTips: "Weather is variable year-round; late spring to early fall is most pleasant."
  }
];

// GET / - Get all destinations
router.get('/', (req, res) => {
  const { region, search } = req.query;
  
  let filteredDestinations = destinations;
  
  // Filter by region if specified
  if (region) {
    filteredDestinations = filteredDestinations.filter(dest => 
      dest.region.toLowerCase() === region.toLowerCase()
    );
  }
  
  // Filter by search term if specified
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredDestinations = filteredDestinations.filter(dest => 
      dest.name.toLowerCase().includes(searchTerm) ||
      dest.country.toLowerCase().includes(searchTerm) ||
      dest.description.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json(filteredDestinations);
});

// GET /regions/:region - region-wise destinations
router.get('/regions/:region', (req, res) => {
  const region = req.params.region.toLowerCase();
  const items = destinations.filter(d => d.region.toLowerCase() === region);
  res.json(items);
});

// GET /:id - Get specific destination
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const destination = destinations.find(dest => dest.id === id);
  
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  
  res.json(destination);
});

module.exports = router;
