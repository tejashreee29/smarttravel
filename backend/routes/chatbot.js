const express = require('express');
const router = express.Router();

// GET / - Basic endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API endpoint is working'
  });
});

module.exports = router;
