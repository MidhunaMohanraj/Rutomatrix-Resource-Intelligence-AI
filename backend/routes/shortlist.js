// routes/shortlist.js
const express = require('express');
const router = express.Router();

// POST /api/shortlist - Add candidate to shortlist
router.post('/', async (req, res, next) => {
  const db = req.app.locals.db;
  const { searchRequestId, candidateId, shortlistedBy, notes } = req.body;
  try {
    const { rows } = await db.query(`
      INSERT INTO shortlisted_candidates (search_request_id, candidate_id, shortlisted_by, notes)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (search_request_id, candidate_id) DO UPDATE SET notes = EXCLUDED.notes, updated_at = NOW()
      RETURNING *
    `, [searchRequestId, candidateId, shortlistedBy || 'Resource Manager', notes]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// GET /api/shortlist/:searchRequestId
router.get('/:searchRequestId', async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const { rows } = await db.query(`
      SELECT sc.*, c.name, c.role, c.experience_years, c.availability_status, c.allocation_percentage, c.location, c.avatar_initials, c.rating,
        COALESCE(json_agg(json_build_object('skill_name', s.name)) FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
      FROM shortlisted_candidates sc
      JOIN candidates c ON c.id = sc.candidate_id
      LEFT JOIN candidate_skills cs ON cs.candidate_id = c.id
      LEFT JOIN skills s ON s.id = cs.skill_id
      WHERE sc.search_request_id = $1
      GROUP BY sc.id, c.id
      ORDER BY sc.shortlisted_at DESC
    `, [req.params.searchRequestId]);
    res.json(rows);
  } catch (err) { next(err); }
});

// PATCH /api/shortlist/:id/stage - Move candidate through pipeline stages
router.patch('/:id/stage', async (req, res, next) => {
  const db = req.app.locals.db;
  const { stage } = req.body;
  const validStages = ['shortlisted', 'interviewing', 'allocated', 'rejected'];
  if (!validStages.includes(stage)) return res.status(400).json({ error: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
  try {
    const { rows } = await db.query(`UPDATE shortlisted_candidates SET stage=$1, updated_at=NOW() WHERE id=$2 RETURNING *`, [stage, req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Shortlist entry not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/shortlist/:id
router.delete('/:id', async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    await db.query(`DELETE FROM shortlisted_candidates WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
