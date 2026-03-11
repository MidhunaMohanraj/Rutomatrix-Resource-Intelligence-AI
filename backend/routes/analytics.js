// routes/analytics.js
const express = require('express');
const router = express.Router();

// GET /api/analytics/overview
router.get('/overview', async (req, res, next) => {
  const db = req.app.locals.db;
  try {
    const [searches, candidates, shortlists, topSkills, recentActivity] = await Promise.all([
      db.query(`SELECT COUNT(*) total, COUNT(*) FILTER (WHERE status='completed') completed, AVG(processing_time_ms) avg_time FROM search_requests`),
      db.query(`SELECT availability_status, COUNT(*) count FROM candidates WHERE is_active=TRUE GROUP BY availability_status`),
      db.query(`SELECT COUNT(*) total, COUNT(*) FILTER (WHERE stage='allocated') allocated FROM shortlisted_candidates`),
      db.query(`SELECT s.name skill, COUNT(*) count FROM search_results sr JOIN candidates c ON c.id=sr.candidate_id JOIN candidate_skills cs ON cs.candidate_id=c.id JOIN skills s ON s.id=cs.skill_id GROUP BY s.name ORDER BY count DESC LIMIT 10`),
      db.query(`SELECT DATE(created_at) date, COUNT(*) searches, COUNT(*) FILTER (WHERE status='completed') matches FROM search_requests WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY DATE(created_at) ORDER BY date DESC`),
    ]);

    const avgScore = await db.query(`SELECT AVG(overall_score) avg FROM search_results`);
    const scoreDistribution = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE overall_score >= 90) excellent,
        COUNT(*) FILTER (WHERE overall_score >= 75 AND overall_score < 90) good,
        COUNT(*) FILTER (WHERE overall_score >= 60 AND overall_score < 75) fair,
        COUNT(*) FILTER (WHERE overall_score < 60) poor
      FROM search_results
    `);

    res.json({
      searches: searches.rows[0],
      candidates: candidates.rows,
      shortlists: shortlists.rows[0],
      topSkills: topSkills.rows,
      recentActivity: recentActivity.rows,
      avgMatchScore: parseFloat(avgScore.rows[0].avg || 0).toFixed(1),
      scoreDistribution: scoreDistribution.rows[0],
    });
  } catch (err) { next(err); }
});

module.exports = router;
