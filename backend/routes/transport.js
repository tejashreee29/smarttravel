const express = require('express');
const router = express.Router();

// GET / - transport guidance by city (simple knowledge base)
router.get('/', (req, res) => {
  const { city = '' } = req.query;
  const key = String(city).toLowerCase();
  const kb = {
    'london': {
      public: 'Underground (Tube), buses, Overground. Use Oyster/contactless; daily caps make it affordable.',
      taxi: 'Black cabs can be hailed; licensed minicabs via apps. Avoid unlicensed cabs.',
      rideshare: 'Uber, Bolt, Free Now available across Greater London.',
      rental: 'Driving in central London not advised (congestion/ULEZ); consider trains for day trips.'
    },
    'tokyo': {
      public: 'JR + subway lines cover most areas. Get a Suica/PASMO IC card for seamless travel.',
      taxi: 'Clean and safe but pricey; doors open automatically. Cash/IC cards commonly accepted.',
      rideshare: 'Limited; apps often dispatch regular taxis with app pricing.',
      rental: 'Not recommended in central Tokyo; parking expensive and roads complex.'
    },
    'paris': {
      public: 'Metro, RER, buses, trams. Buy Navigo Easy or Navigo passes; zones affect airport travel.',
      taxi: 'Official taxis from stands; note surcharges to airports.',
      rideshare: 'Uber, Bolt widely available; surge pricing during peak times.',
      rental: 'City driving/parking difficult; trains great for day trips (Versailles, Giverny).' 
    },
    'new york': {
      public: '24/7 subway plus buses. OMNY tap-to-pay being rolled out; weekly caps for savings.',
      taxi: 'Yellow cabs abundant in Manhattan; flat fares to JFK from Manhattan.',
      rideshare: 'Uber, Lyft ubiquitous; compare ETAs and prices.',
      rental: 'Traffic/parking challenging; rent only for out-of-city trips.'
    }
  };

  const data = kb[key] || {
    public: 'Public transport varies by city. Check local metro/bus passes and tourist cards.',
    taxi: 'Use licensed taxis or hotel/official stands. Verify meters/fixed fares when applicable.',
    rideshare: 'Major cities often support Uber/Lyft/Bolt/Grab. Availability depends on regulations.',
    rental: 'Rent a car for regional trips; check parking rules and tolls.'
  };
  res.json(data);
});

module.exports = router;
