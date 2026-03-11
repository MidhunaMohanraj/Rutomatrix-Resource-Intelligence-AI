// services/llmService.js
// ─────────────────────────────────────────────────────────────────────────────
// LLM Service: Isolated provider layer. Swap provider without changing core logic.
// Supports: Anthropic Claude | OpenAI | Ollama (local Mac) | LM Studio (local Mac)
// ─────────────────────────────────────────────────────────────────────────────

const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

const PROVIDER = process.env.LLM_PROVIDER || 'anthropic'; // anthropic | openai | ollama | lmstudio

// ── Provider implementations ──────────────────────────────────────────────────

async function callAnthropic(systemPrompt, userPrompt, options = {}) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: options.maxTokens || 1500,
    temperature: options.temperature || 0.3,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
  return response.content[0].text;
}

async function callOpenAI(systemPrompt, userPrompt, options = {}) {
  const { OpenAI } = require('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    max_tokens: options.maxTokens || 1500,
    temperature: options.temperature || 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  return response.choices[0].message.content;
}

async function callOllama(systemPrompt, userPrompt, options = {}) {
  // Ollama runs locally on Mac: brew install ollama && ollama pull llama3.2
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.2';
  const response = await axios.post(`${baseUrl}/api/chat`, {
    model,
    stream: false,
    options: { temperature: options.temperature || 0.3 },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  return response.data.message.content;
}

async function callLMStudio(systemPrompt, userPrompt, options = {}) {
  // LM Studio OpenAI-compatible API: http://localhost:1234/v1
  const baseUrl = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1';
  const model = process.env.LM_STUDIO_MODEL || 'local-model';
  const response = await axios.post(`${baseUrl}/chat/completions`, {
    model,
    max_tokens: options.maxTokens || 1500,
    temperature: options.temperature || 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  return response.data.choices[0].message.content;
}

// ── Main exported function ────────────────────────────────────────────────────

/**
 * Call the configured LLM provider
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} options - { maxTokens, temperature }
 * @returns {Promise<string>} LLM response text
 */
async function callLLM(systemPrompt, userPrompt, options = {}) {
  console.log(`[LLM] Provider: ${PROVIDER}`);
  switch (PROVIDER) {
    case 'anthropic':  return callAnthropic(systemPrompt, userPrompt, options);
    case 'openai':     return callOpenAI(systemPrompt, userPrompt, options);
    case 'ollama':     return callOllama(systemPrompt, userPrompt, options);
    case 'lmstudio':   return callLMStudio(systemPrompt, userPrompt, options);
    default: throw new Error(`Unknown LLM provider: ${PROVIDER}`);
  }
}

/**
 * Parse and extract skills from a job description
 */
async function extractSkillsFromJD(jobDescription) {
  const system = `You are an expert technical recruiter. Extract skills from job descriptions.
Respond ONLY with a JSON array of skill strings. No other text. Example: ["React", "Node.js", "AWS"]`;
  const result = await callLLM(system, `Extract required skills from:\n\n${jobDescription}`);
  try {
    const cleaned = result.replace(/```json?|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return result.match(/["']([^"']+)["']/g)?.map(s => s.replace(/["']/g, '')) || [];
  }
}

/**
 * Rank candidates against a job description
 * @returns {Promise<object>} { extractedSkills, rankings, summary }
 */
async function rankCandidates(jobDescription, candidates) {
  const system = `You are an expert resource allocation AI for a tech company.
Analyze the job description and rank candidates by fit.
Respond ONLY with valid JSON matching this exact schema:
{
  "extractedSkills": ["skill1", "skill2"],
  "rankings": [
    {
      "candidateId": 1,
      "score": 92,
      "skillMatch": 88,
      "experienceScore": 90,
      "availabilityScore": 100,
      "allocationScore": 100,
      "explanation": "Why this candidate fits",
      "skillGaps": ["missing skill 1"],
      "strengths": ["key strength 1", "key strength 2"]
    }
  ],
  "summary": "Overall analysis in 2 sentences"
}`;

  const candidateSummaries = candidates.map(c => ({
    id: c.id, name: c.name, role: c.role,
    skills: c.skills, experience_years: c.experience_years,
    availability: c.availability_status, current_allocation_pct: c.allocation_percentage,
  }));

  const prompt = `Job Description:\n${jobDescription}\n\nCandidates:\n${JSON.stringify(candidateSummaries, null, 2)}\n\nRank ALL ${candidates.length} candidates. Return full JSON only.`;

  const raw = await callLLM(system, prompt, { maxTokens: 2000, temperature: 0.2 });
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('LLM returned invalid JSON');
  return JSON.parse(jsonMatch[0]);
}

module.exports = { callLLM, extractSkillsFromJD, rankCandidates };
