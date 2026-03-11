// routes/externalSearch.js
const express = require('express');
const router = express.Router();
const { searchExternalCandidates } = require('../services/externalScraper');

router.post('/run', async (req, res) => {
  const { skills = [], location = 'India', requiredSkills = [] } = req.body;

  if (!skills.length) {
    return res.status(400).json({ error: 'skills array is required' });
  }

  try {
    console.log('[API] External search request — skills:', skills, 'location:', location);
    const candidates = await searchExternalCandidates({ skills, location, requiredSkills });
    res.json({ success: true, count: candidates.length, candidates, source: 'playwright', timestamp: new Date() });
  } catch (err) {
    console.error('[API] External search failed:', err.message);
    res.status(500).json({ error: err.message, candidates: [] });
  }
});

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'external-search' }));

module.exports = router;
