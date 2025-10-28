const express = require('express');
const router = express.Router();

// Sample exchange rates (in a real app, you'd fetch from a currency API)
const exchangeRates = {
  USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, AUD: 1.35, CAD: 1.25, CHF: 0.92, CNY: 6.45, INR: 74.5 },
  EUR: { USD: 1.18, GBP: 0.86, JPY: 129.5, AUD: 1.59, CAD: 1.47, CHF: 1.08, CNY: 7.6, INR: 87.8 },
  GBP: { USD: 1.37, EUR: 1.16, JPY: 150.8, AUD: 1.85, CAD: 1.71, CHF: 1.26, CNY: 8.84, INR: 102.1 },
  JPY: { USD: 0.009, EUR: 0.0077, GBP: 0.0066, AUD: 0.012, CAD: 0.011, CHF: 0.0084, CNY: 0.058, INR: 0.68 },
  AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.5, CAD: 0.93, CHF: 0.68, CNY: 4.78, INR: 55.2 },
  CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 88.0, AUD: 1.07, CHF: 0.74, CNY: 5.16, INR: 59.6 },
  CHF: { USD: 1.09, EUR: 0.93, GBP: 0.79, JPY: 119.6, AUD: 1.47, CAD: 1.35, CNY: 7.03, INR: 81.2 },
  CNY: { USD: 0.155, EUR: 0.132, GBP: 0.113, JPY: 17.0, AUD: 0.209, CAD: 0.194, CHF: 0.142, INR: 11.55 },
  INR: { USD: 0.0134, EUR: 0.0114, GBP: 0.0098, JPY: 1.47, AUD: 0.018, CAD: 0.017, CHF: 0.012, CNY: 0.087 }
};

// Helper: try live rate first, fallback to static table
async function getRate(fromCurrency, toCurrency) {
  try {
    // Use a free, no-key API
    const url = `https://api.exchangerate.host/convert?from=${encodeURIComponent(fromCurrency)}&to=${encodeURIComponent(toCurrency)}&amount=1`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.result === 'number') {
        return { rate: data.result, source: 'live' };
      }
    }
  } catch (err) {
    // ignore and fallback
  }

  // Fallback to static table
  if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
    return { rate: exchangeRates[fromCurrency][toCurrency], source: 'static' };
  }
  return { rate: null, source: 'none' };
}

// GET / - Convert currency
router.get('/', async (req, res) => {
  const { amount, from, to } = req.query;
  
  if (!amount || !from || !to) {
    return res.status(400).json({ 
      error: 'Amount, from, and to parameters are required',
      example: '/api/currency?amount=100&from=USD&to=EUR'
    });
  }
  
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  
  const fromCurrency = from.toUpperCase();
  const toCurrency = to.toUpperCase();
  
  // Same currency
  if (fromCurrency === toCurrency) {
    return res.json({
      amount: amountNum,
      from: fromCurrency,
      to: toCurrency,
      rate: 1,
      convertedAmount: amountNum,
      timestamp: new Date().toISOString()
    });
  }
  
  // Attempt to get rate (live then fallback)
  const { rate, source } = await getRate(fromCurrency, toCurrency);
  if (rate === null) {
    return res.status(400).json({
      error: `Conversion from ${fromCurrency} to ${toCurrency} not supported`,
      supportedCurrencies: Object.keys(exchangeRates)
    });
  }

  const convertedAmount = amountNum * rate;
  
  res.json({
    amount: amountNum,
    from: fromCurrency,
    to: toCurrency,
    rate: rate,
    convertedAmount: convertedAmount,
    timestamp: new Date().toISOString(),
    source
  });
});

// GET /rates - Get all exchange rates
router.get('/rates', (req, res) => {
  res.json({
    rates: exchangeRates,
    supportedCurrencies: Object.keys(exchangeRates),
    lastUpdated: new Date().toISOString()
  });
});

module.exports = router;
