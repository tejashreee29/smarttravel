const express = require('express');
const router = express.Router();
const db = require('../db');

// GET / - by country query
router.get('/', (req, res) => {
  const { country } = req.query;
  if (!country) {
    return res.status(400).json({ error: 'country query param is required, e.g. /api/culture?country=Japan' });
  }

  const sql = 'SELECT country, greetings, dining, customs, taboos, region FROM culture WHERE LOWER(country) = LOWER(?)';
  db.get(sql, [country], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      // Generic fallback so culture.html always has data and persist it so DB gains coverage over time
      const generic = {
        country,
        region: 'americas',
        greetings: 'Greetings vary by region and context. Use polite forms, learn a local hello, and observe customs.',
        dining: 'Check local table etiquette, tipping norms, and meal timing. When unsure, follow locals.',
        customs: 'Be respectful at religious/cultural sites, dress modestly when needed, and ask before photographing people.',
        taboos: 'Avoid sensitive topics (politics, religion) with strangers; research hand gestures and body-language taboos.'
      };
      const upsert = 'INSERT OR IGNORE INTO culture (country, greetings, dining, customs, taboos, region) VALUES (?,?,?,?,?,?)';
      db.run(upsert, [generic.country, generic.greetings, generic.dining, generic.customs, generic.taboos, generic.region], () => {
        return res.json(generic);
      });
      return;
    }
    res.json(row);
  });
});

module.exports = router;
