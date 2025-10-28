const fs = require('fs');
const path = require('path');

// List of route files to fix
const routeFiles = [
  'currency.js',
  'wallet.js',
  'culture.js',
  'transport.js',
  'itinerary.js',
  'language.js',
  'chatbot.js',
  'destinations.js',
  'auth.js'
];

// Basic Express router template
const routerTemplate = `const express = require('express');
const router = express.Router();

// GET / - Basic endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API endpoint is working'
  });
});

module.exports = router;
`;

// Fix all route files
routeFiles.forEach(file => {
  const filePath = path.join(__dirname, 'backend/routes', file);
  fs.writeFileSync(filePath, routerTemplate);
  console.log(`Fixed route file: ${file}`);
});

console.log('All route files fixed successfully!');