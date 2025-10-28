const express = require('express');
const router = express.Router();
const db = require('../db');

// POST / - add expense
router.post('/', (req, res) => {
  const { userId = null, title, amount, currency } = req.body || {};
  if (!title || !amount || !currency) {
    return res.status(400).json({ error: 'title, amount, currency required' });
  }
  db.run(
    `INSERT INTO expenses (user_id, title, amount, currency) VALUES (?, ?, ?, ?)`,
    [userId, title, parseFloat(amount), currency],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to add expense' });
      res.json({ id: this.lastID, title, amount: parseFloat(amount), currency });
    }
  );
});

// GET / - list expenses
router.get('/', (req, res) => {
  db.all(`SELECT id, title, amount, currency, date FROM expenses ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to list expenses' });
    res.json(rows);
  });
});

// DELETE /:id - delete expense
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  db.run(`DELETE FROM expenses WHERE id=?`, [id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete expense' });
    res.json({ deleted: this.changes > 0 });
  });
});

module.exports = router;
