const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /generate - generate a simple itinerary from dates
router.post('/generate', (req, res) => {
  const { name, startDate, endDate } = req.body || {};
  if (!name || !startDate || !endDate) {
    return res.status(400).json({ error: 'name, startDate, endDate are required' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return res.status(400).json({ error: 'Invalid date range' });
  }

  const dayCount = Math.round((end - start) / (24 * 60 * 60 * 1000)) + 1;

  // Destination-specific suggestion bank (fallback to generic if not found)
  const dest = String(name).toLowerCase();
  const suggestionBank = {
    'paris': [
      { time: '09:00', description: 'Café de Flore (Saint-Germain) — Metro: Saint-Germain-des-Prés (Line 4)' },
      { time: '10:30', description: 'Louvre Museum — Metro: Palais Royal–Musée du Louvre (Lines 1/7)' },
      { time: '13:00', description: 'Le Marais food crawl — Metro: Saint-Paul (Line 1)' },
      { time: '15:00', description: 'Notre-Dame & Île de la Cité — Metro: Cité (Line 4)' },
      { time: '18:00', description: 'Eiffel Tower & Seine cruise — Metro: Trocadéro (Lines 6/9)' }
    ],
    'tokyo': [
      { time: '09:00', description: 'Tsukiji Outer Market breakfast — Toei Oedo Line: Tsukijishijo' },
      { time: '10:30', description: 'Sensō-ji & Nakamise — Ginza Line: Asakusa' },
      { time: '13:00', description: 'Akihabara ramen — JR Yamanote: Akihabara' },
      { time: '15:00', description: 'Meiji Shrine & Harajuku — JR Yamanote: Harajuku' },
      { time: '18:00', description: 'Shibuya Crossing & izakaya — JR Yamanote: Shibuya' }
    ],
    'new york': [
      { time: '09:00', description: 'Central Park bagels — Subway: 59 St–Columbus Circle (A/C/B/D/1)' },
      { time: '10:30', description: 'Top of the Rock — Subway: 47–50 St Rockefeller Ctr (B/D/F/M)' },
      { time: '13:00', description: 'Chelsea Market lunch — Subway: 14 St / 8 Av (A/C/E)' },
      { time: '15:00', description: 'High Line & Hudson Yards — Subway: 34 St–Hudson Yards (7)' },
      { time: '18:00', description: 'Broadway or Times Square — Subway: Times Sq–42 St (N/Q/R/W/1/2/3/7)' }
    ],
    'bali': [
      { time: '09:00', description: 'Ubud breakfast with rice terrace views — Taxi/scooter to Ubud' },
      { time: '10:30', description: 'Tegalalang Rice Terrace — Taxi/scooter; entry fee applies' },
      { time: '13:00', description: 'Local warung lunch (try nasi campur) — Walk/short ride' },
      { time: '15:00', description: 'Tirta Empul or Uluwatu Temple — Taxi; dress modestly' },
      { time: '18:00', description: 'Jimbaran Bay sunset seafood — Taxi; book table on the sand' }
    ],
    'london': [
      { time: '09:00', description: 'Soho breakfast — Tube: Tottenham Court Road (Central/Northern)' },
      { time: '10:30', description: 'Westminster & Big Ben — Tube: Westminster (Circle/District/Jubilee)' },
      { time: '13:00', description: 'Borough Market lunch — Tube: London Bridge (Jubilee/Northern)' },
      { time: '15:00', description: 'Tower of London & Tower Bridge — Tube: Tower Hill (Circle/District)' },
      { time: '18:00', description: 'West End show or pub — Tube: Piccadilly Circus (Bakerloo/Piccadilly)' }
    ],
    'rome': [
      { time: '09:00', description: 'Espresso near Piazza Navona — Bus 64/62 area' },
      { time: '10:30', description: 'Colosseum & Roman Forum — Metro B: Colosseo' },
      { time: '13:00', description: 'Trastevere trattoria lunch — Tram 8: Trastevere' },
      { time: '15:00', description: 'Vatican Museums & St. Peter’s — Metro A: Ottaviano' },
      { time: '18:00', description: 'Trevi Fountain & gelato — Metro A: Barberini' }
    ],
    'sydney': [
      { time: '09:00', description: 'Breakfast at The Rocks — Ferry/Train: Circular Quay' },
      { time: '10:30', description: 'Opera House & Botanic Garden — Walk from Circular Quay' },
      { time: '13:00', description: 'Circular Quay lunch — Ferry: Manly option' },
      { time: '15:00', description: 'Bondi to Coogee coastal walk — Bus 333 to Bondi' },
      { time: '18:00', description: 'Darling Harbour dinner — Light Rail L1' }
    ],
    'cape town': [
      { time: '09:00', description: 'V&A Waterfront breakfast — MyCiTi bus to Waterfront' },
      { time: '10:30', description: 'Table Mountain cableway — MyCiTi shuttle / taxi (weather dependent)' },
      { time: '13:00', description: 'Camps Bay seafood lunch — MyCiTi 107' },
      { time: '15:00', description: 'Bo-Kaap & District Six Museum — Uber/taxi' },
      { time: '18:00', description: 'Signal Hill sundowners — Uber/taxi' }
    ]
  };

  const generic = [
    { time: '09:00', description: 'Breakfast at a local café' },
    { time: '10:30', description: 'Visit a top attraction' },
    { time: '13:00', description: 'Lunch at a recommended spot' },
    { time: '15:00', description: 'Neighborhood walk or museum' },
    { time: '18:00', description: 'Dinner and evening activity' }
  ];

  // Choose suggestion set; if destination has spaces, try exact and first word
  const bank = suggestionBank[dest] || suggestionBank[dest.split(' ')[0]] || generic;

  const days = [];
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    // rotate suggestions across days to create variety
    const rotated = bank.map((item, idx) => bank[(idx + i) % bank.length]);
    days.push({
      date: d.toISOString().split('T')[0],
      activities: rotated
    });
  }

  res.json({ name, days });
});

// POST /save - save itinerary with generated structure
router.post('/save', (req, res) => {
  const { userId = null, name, startDate, endDate, days } = req.body || {};
  if (!name || !startDate || !endDate || !Array.isArray(days)) {
    return res.status(400).json({ error: 'name, startDate, endDate, days[] required' });
  }

  db.serialize(() => {
    db.run(
      `INSERT INTO itineraries (user_id, tripName, startDate, endDate, details) VALUES (?, ?, ?, ?, ?)`,
      [userId, name, startDate, endDate, null],
      function(err) {
        if (err) return res.status(500).json({ error: 'Failed to save itinerary' });
        const itineraryId = this.lastID;
        const insertDay = db.prepare(`INSERT INTO itinerary_days (itinerary_id, date) VALUES (?, ?)`);
        const insertActivity = db.prepare(`INSERT INTO itinerary_activities (day_id, time, description) VALUES (?, ?, ?)`);

        const dayIds = [];
        days.forEach((day) => {
          insertDay.run(itineraryId, day.date, function(e) {
            if (e) return;
            const dayId = this.lastID;
            dayIds.push(dayId);
            (day.activities || []).forEach(act => insertActivity.run(dayId, act.time, act.description));
          });
        });

        insertDay.finalize(() => insertActivity.finalize(() => {
          res.json({ id: itineraryId, saved: true });
        }));
      }
    );
  });
});

// GET /list - list itineraries (basic)
router.get('/list', (req, res) => {
  db.all(`SELECT id, tripName, startDate, endDate FROM itineraries ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to list itineraries' });
    res.json(rows);
  });
});

// GET /:id - fetch itinerary with days and activities
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  db.get(`SELECT id, tripName as name, startDate, endDate FROM itineraries WHERE id=?`, [id], (err, itin) => {
    if (err || !itin) return res.status(404).json({ error: 'Not found' });
    db.all(`SELECT id, date FROM itinerary_days WHERE itinerary_id=? ORDER BY date`, [id], (e, days) => {
      if (e) return res.status(500).json({ error: 'Failed to load days' });
      const dayIds = days.map(d => d.id);
      if (dayIds.length === 0) return res.json({ ...itin, days: [] });
      const placeholders = dayIds.map(() => '?').join(',');
      db.all(`SELECT day_id, time, description FROM itinerary_activities WHERE day_id IN (${placeholders})`, dayIds, (ea, acts) => {
        if (ea) return res.status(500).json({ error: 'Failed to load activities' });
        const daysFull = days.map(d => ({ date: d.date, activities: acts.filter(a => a.day_id === d.id).map(a => ({ time: a.time, description: a.description })) }));
        res.json({ ...itin, days: daysFull });
      });
    });
  });
});

module.exports = router;
