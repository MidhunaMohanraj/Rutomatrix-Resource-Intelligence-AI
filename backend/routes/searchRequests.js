// routes/searchRequests.js
const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
  const db = req.app.locals.db;
  const { title, job_description, requested_by } = req.body;
  if (!job_description) return res.status(400).json({ error: 'job_description is required' });
  try {
    const { rows } = await db.query(
      `INSERT INTO search_requests (title, job_description, requested_by) VALUES ($1,$2,$3) RETURNING *`,
      [title || 'Untitled Search', job_description, requested_by || 'Resource Manager']
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const { rows } = await db.query(`SELECT * FROM search_requests ORDER BY created_at DESC LIMIT 50`);
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const { rows } = await db.query(`SELECT * FROM search_requests WHERE id=$1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
