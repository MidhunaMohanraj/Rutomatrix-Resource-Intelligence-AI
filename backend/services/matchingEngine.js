// services/matchingEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Core AI Matching Engine
// 1. Parse JD → Extract skills (via LLM)
// 2. Score candidates (AI + rule-based fallback)
// 3. Return ranked list with explanation and skill gaps
// ─────────────────────────────────────────────────────────────────────────────

const { rankCandidates, extractSkillsFromJD } = require('./llmService');

/**
 * Scoring weights (configurable via env or DB settings)
 */
const DEFAULT_WEIGHTS = {
  skillMatch:   parseFloat(process.env.WEIGHT_SKILL || 0.40),
  experience:   parseFloat(process.env.WEIGHT_EXP   || 0.25),
  availability: parseFloat(process.env.WEIGHT_AVAIL || 0.20),
  allocation:   parseFloat(process.env.WEIGHT_ALLOC || 0.15),
};

// ── Rule-based scoring fallback ───────────────────────────────────────────────

function scoreSkillMatch(candidateSkills, requiredSkills) {
  if (!requiredSkills.length) return 50;
  const cSkills = candidateSkills.map(s => s.toLowerCase());
  const matched = requiredSkills.filter(s => cSkills.includes(s.toLowerCase())).length;
  return Math.round((matched / requiredSkills.length) * 100);
}

function scoreExperience(years, requiredYears = 3) {
  if (years >= requiredYears + 4) return 100;
  if (years >= requiredYears)     return 85;
  if (years >= requiredYears - 1) return 65;
  return Math.max(20, years * 10);
}

function scoreAvailability(status) {
  const map = { available: 100, partial: 65, busy: 20, unavailable: 0 };
  return map[status] || 50;
}

function scoreAllocation(pct) {
  return Math.max(0, 100 - pct);
}

function computeWeightedScore(scores, weights = DEFAULT_WEIGHTS) {
  return Math.round(
    scores.skillMatch   * weights.skillMatch   +
    scores.experience   * weights.experience   +
    scores.availability * weights.availability +
    scores.allocation   * weights.allocation
  );
}

function detectSkillGaps(candidateSkills, requiredSkills) {
  const cSkills = candidateSkills.map(s => s.toLowerCase());
  return requiredSkills.filter(s => !cSkills.includes(s.toLowerCase()));
}

// ── Rule-based fallback (when LLM fails) ─────────────────────────────────────

function rankCandidatesLocally(jobDescription, candidates, requiredSkills) {
  return candidates.map(c => {
    const skills = c.skills.map(s => s.skill_name);
    const skillMatch   = scoreSkillMatch(skills, requiredSkills);
    const experience   = scoreExperience(c.experience_years, 3);
    const availability = scoreAvailability(c.availability_status);
    const allocation   = scoreAllocation(c.allocation_percentage || 0);

    const scores = { skillMatch, experience, availability, allocation };
    const score  = computeWeightedScore(scores);
    const gaps   = detectSkillGaps(skills, requiredSkills);
    const strengths = skills.filter(s =>
      requiredSkills.some(r => r.toLowerCase() === s.toLowerCase())
    ).slice(0, 3);

    return {
      candidateId: c.id,
      score,
      skillMatch,
      experienceScore: experience,
      availabilityScore: availability,
      allocationScore: allocation,
      explanation: `${c.name} matches ${100 - Math.round((gaps.length / Math.max(requiredSkills.length, 1)) * 100)}% of required skills with ${c.experience_years} years of experience.`,
      skillGaps: gaps,
      strengths,
    };
  }).sort((a, b) => b.score - a.score);
}

// ── Main matching function ────────────────────────────────────────────────────

/**
 * Run full AI matching pipeline
 * @param {string} jobDescription
 * @param {Array} candidates - from DB with skills[]
 * @param {object} options - { useAI: true, weights: {} }
 */
async function runMatching(jobDescription, candidates, options = {}) {
  const { useAI = true, weights = DEFAULT_WEIGHTS } = options;

  let extractedSkills = [];
  let rankings = [];
  let summary = '';
  let aiUsed = false;

  // Step 1: Try AI matching
  if (useAI) {
    try {
      const aiResult = await rankCandidates(jobDescription, candidates);
      extractedSkills = aiResult.extractedSkills || [];
      summary = aiResult.summary || '';
      rankings = aiResult.rankings.sort((a, b) => b.score - a.score);
      aiUsed = true;
    } catch (err) {
      console.warn('[MatchingEngine] AI failed, falling back to rule-based:', err.message);
    }
  }

  // Step 2: Fallback to rule-based
  if (!aiUsed) {
    try {
      extractedSkills = await extractSkillsFromJD(jobDescription);
    } catch {
      // Best-effort keyword extraction
      const commonSkills = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'TypeScript', 'PostgreSQL'];
      extractedSkills = commonSkills.filter(s => jobDescription.toLowerCase().includes(s.toLowerCase()));
    }
    rankings = rankCandidatesLocally(jobDescription, candidates, extractedSkills);
    summary = `Ranked ${candidates.length} candidates using rule-based scoring (AI unavailable).`;
  }

  return { extractedSkills, rankings, summary, aiUsed, timestamp: new Date().toISOString() };
}

module.exports = { runMatching, scoreSkillMatch, scoreExperience, DEFAULT_WEIGHTS };
