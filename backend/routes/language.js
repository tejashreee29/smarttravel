const express = require('express');
const router = express.Router();

// POST /translate - proxy to LibreTranslate with fallback
router.post('/translate', async (req, res) => {
  try {
    const { q, source = 'en', target = 'fr' } = req.body || {};
    if (!q) return res.status(400).json({ error: 'q (text) is required' });

    // Try LibreTranslate (public instance)
    try {
      const r = await fetch('https://translate.astian.org/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, source, target, format: 'text' })
      });
      if (r.ok) {
        const data = await r.json();
        if (data && data.translatedText) {
          return res.json({ translatedText: data.translatedText, source: 'live' });
        }
      }
    } catch (_) {}

    // Fallback mock basic mappings for en->fr and en->es
    const mock = {
      'en-fr': { 'Hello': 'Bonjour', 'Thank you': 'Merci', 'Yes': 'Oui', 'Where is': 'Où est', 'How much does it cost': 'Combien ça coûte', 'I need help': "J'ai besoin d'aide" },
      'en-es': { 'Hello': 'Hola', 'Thank you': 'Gracias', 'Yes': 'Sí', 'Where is': 'Dónde está', 'How much does it cost': 'Cuánto cuesta', 'I need help': 'Necesito ayuda' }
    };
    const key = `${source}-${target}`;
    const translatedText = (mock[key] && mock[key][q]) ? mock[key][q] : `[${target}] ${q}`;
    res.json({ translatedText, source: 'fallback' });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

module.exports = router;
