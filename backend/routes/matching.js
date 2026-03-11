// routes/matching.js
const express = require('express');
const router = express.Router();
const { runMatching } = require('../services/matchingEngine');

/**
 * POST /api/matching/run
 * Body: { searchRequestId, jobDescription, candidateIds? }
 * Runs AI matching and stores results
 */
router.post('/run', async (req, res, next) => {
  const db = req.app.locals.db;
  const { searchRequestId, jobDescription, candidateIds } = req.body;

  if (!jobDescription) return res.status(400).json({ error: 'jobDescription is required' });

  const startTime = Date.now();

  try {
    // Update search request status
    if (searchRequestId) {
      await db.query(`UPDATE search_requests SET status='processing' WHERE id=$1`, [searchRequestId]);
    }

    // Fetch candidates with skills
    let candidateQuery = `
      SELECT c.*, 
        COALESCE(json_agg(json_build_object('skill_name', s.name, 'proficiency', cs.proficiency)) 
          FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
      FROM candidates c
      LEFT JOIN candidate_skills cs ON cs.candidate_id = c.id
      LEFT JOIN skills s ON s.id = cs.skill_id
      WHERE c.is_active = TRUE
    `;
    const params = [];
    if (candidateIds?.length) {
      params.push(candidateIds);
      candidateQuery += ` AND c.id = ANY($1)`;
    }
    candidateQuery += ` GROUP BY c.id`;

    const { rows: candidates } = await db.query(candidateQuery, params);

    if (!candidates.length) return res.status(404).json({ error: 'No candidates found' });

    // Run matching engine
    const result = await runMatching(jobDescription, candidates);
    const processingTime = Date.now() - startTime;

    // Store results if we have a search request
    if (searchRequestId) {
      // Update search request
      await db.query(`
        UPDATE search_requests SET
          status = 'completed',
          extracted_skills = $1,
          ai_summary = $2,
          ai_used = $3,
          processing_time_ms = $4,
          completed_at = NOW()
        WHERE id = $5
      `, [JSON.stringify(result.extractedSkills), result.summary, result.aiUsed, processingTime, searchRequestId]);

      // Insert ranked results
      await db.query(`DELETE FROM search_results WHERE search_request_id = $1`, [searchRequestId]);
      for (const [idx, r] of result.rankings.entries()) {
        await db.query(`
          INSERT INTO search_results (
            search_request_id, candidate_id, rank, overall_score,
            skill_match_score, experience_score, availability_score, allocation_score,
            explanation, skill_gaps, strengths
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        `, [
          searchRequestId, r.candidateId, idx + 1, r.score,
          r.skillMatch, r.experienceScore, r.availabilityScore, r.allocationScore,
          r.explanation, JSON.stringify(r.skillGaps), JSON.stringify(r.strengths),
        ]);
      }
    }

    // Enrich rankings with full candidate data
    const enriched = result.rankings.map(r => ({
      ...r,
      candidate: candidates.find(c => c.id === r.candidateId),
    }));

    res.json({ ...result, rankings: enriched, processingTimeMs: processingTime });

  } catch (err) {
    if (searchRequestId) {
      await db.query(`UPDATE search_requests SET status='failed' WHERE id=$1`, [searchRequestId]).catch(() => {});
    }
    next(err);
  }
});

/**
 * GET /api/matching/results/:searchRequestId
 * Fetch stored results for a previous search
 */
router.get('/results/:searchRequestId', async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const { rows } = await db.query(`
      SELECT sr.*, c.name, c.role, c.experience_years, c.availability_status,
        c.allocation_percentage, c.location, c.avatar_initials, c.rating,
        COALESCE(json_agg(json_build_object('skill_name', s.name)) 
          FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
      FROM search_results sr
      JOIN candidates c ON c.id = sr.candidate_id
      LEFT JOIN candidate_skills cs ON cs.candidate_id = c.id
      LEFT JOIN skills s ON s.id = cs.skill_id
      WHERE sr.search_request_id = $1
      GROUP BY sr.id, c.id
      ORDER BY sr.rank ASC
    `, [req.params.searchRequestId]);
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
