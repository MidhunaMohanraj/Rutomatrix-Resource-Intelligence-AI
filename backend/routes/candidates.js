// routes/candidates.js
const express = require('express');
const router = express.Router();

// GET /api/candidates
router.get('/', async (req, res, next) => {
  const db = req.app.locals.db;
  const { status, search } = req.query;
  try {
    let query = `
      SELECT c.*, COALESCE(json_agg(json_build_object('skill_name', s.name, 'category', s.category, 'proficiency', cs.proficiency))
        FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
      FROM candidates c
      LEFT JOIN candidate_skills cs ON cs.candidate_id = c.id
      LEFT JOIN skills s ON s.id = cs.skill_id
      WHERE c.is_active = TRUE
    `;
    const params = [];
    if (status) { params.push(status); query += ` AND c.availability_status = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND (c.name ILIKE $${params.length} OR c.role ILIKE $${params.length})`; }
    query += ' GROUP BY c.id ORDER BY c.name';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/candidates/:id
router.get('/:id', async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const { rows } = await db.query(`
      SELECT c.*, COALESCE(json_agg(json_build_object('skill_name', s.name, 'category', s.category, 'proficiency', cs.proficiency, 'years', cs.years))
        FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
      FROM candidates c
      LEFT JOIN candidate_skills cs ON cs.candidate_id = c.id
      LEFT JOIN skills s ON s.id = cs.skill_id
      WHERE c.id = $1 GROUP BY c.id
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Candidate not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/candidates
router.post('/', async (req, res, next) => {
  const db = req.app.locals.db;
  const { name, email, role, experience_years, availability_status, allocation_percentage, location, skills = [] } = req.body;
  try {
    const { rows } = await db.query(`
      INSERT INTO candidates (name, email, role, experience_years, availability_status, allocation_percentage, location, avatar_initials)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [name, email, role, experience_years, availability_status || 'available', allocation_percentage || 0, location,
        name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()]);
    const candidate = rows[0];
    // Add skills
    for (const skill of skills) {
      const skillRow = await db.query(`INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id`, [skill]);
      await db.query(`INSERT INTO candidate_skills (candidate_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [candidate.id, skillRow.rows[0].id]);
    }
    res.status(201).json(candidate);
  } catch (err) { next(err); }
});

// PATCH /api/candidates/:id
router.patch('/:id', async (req, res, next) => {
  const db = req.app.locals.db;
  const allowed = ['name', 'role', 'experience_years', 'availability_status', 'allocation_percentage', 'location'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'No valid fields to update' });
  const sets = Object.keys(updates).map((k, i) => `${k} = $${i + 2}`).join(', ');
  try {
    const { rows } = await db.query(`UPDATE candidates SET ${sets}, updated_at=NOW() WHERE id=$1 RETURNING *`, [req.params.id, ...Object.values(updates)]);
    if (!rows.length) return res.status(404).json({ error: 'Candidate not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
