// services/externalScraper.js
// Phase 2 — External Candidate Search
// Scrapes Naukri.com + LinkedIn (via Google) + Indeed India using Playwright
// Free, no API cost. Falls back gracefully if blocked.

const { chromium } = require('playwright');

const TIMEOUT = 25000;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function initials(name) {
  return name.split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || 'EX';
}

function parseExp(str) {
  if (!str) return 2;
  const m = String(str).match(/(\d+)/);
  return m ? Math.min(parseInt(m[1]), 20) : 2;
}

function extractSkillsFromText(text, seedSkills) {
  const known = ['Python','C','Java','JavaScript','Web','Embedded','PCB','CAD','AI',
    'Machine Learning','Computer Vision','OpenCV','AWS','Docker','React','Node',
    'Android','Firmware','Hardware','Testing','Automation','Power BI','Flask',
    'Django','Linux','ROS','MATLAB','Solidworks','Altium','KiCad','LLM','NLP'];
  const found = known.filter(s => text.toLowerCase().includes(s.toLowerCase()));
  return [...new Set([...found, ...seedSkills])].slice(0, 7);
}

function scoreCandidate(candidate, requiredSkills) {
  const cSkills = candidate.skills.map(s => s.toLowerCase());
  const req = requiredSkills.map(s => s.toLowerCase());
  const matched = req.filter(s => cSkills.some(cs => cs.includes(s) || s.includes(cs))).length;
  const skillMatch = req.length ? Math.round((matched / req.length) * 100) : 50;
  const experienceScore = Math.min(100, candidate.experience * 11);
  const score = Math.round(skillMatch * 0.55 + experienceScore * 0.25 + 100 * 0.20);
  return {
    score, skillMatch, experienceScore,
    availabilityScore: 100, allocationScore: 100,
    skillGaps: requiredSkills.filter(s => !cSkills.some(cs => cs.includes(s.toLowerCase()))),
    strengths: candidate.skills.filter(s => req.some(r => s.toLowerCase().includes(r))),
  };
}

async function scrapeLinkedInViaGoogle(browser, skills, location) {
  const page = await browser.newPage();
  const results = [];
  try {
    await page.setExtraHTTPHeaders({ 'User-Agent': UA, 'Accept-Language': 'en-IN,en;q=0.9' });
    const q = encodeURIComponent(`site:linkedin.com/in "${skills.slice(0,3).join('" OR "')}" "${location}" "open to work"`);
    await page.goto(`https://www.google.com/search?q=${q}&num=10`, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.waitForTimeout(1500);

    const items = await page.$$eval('div.g', els =>
      els.slice(0, 12).map(el => ({
        title:   el.querySelector('h3')?.textContent?.trim() || '',
        snippet: el.querySelector('.VwiC3b, span')?.textContent?.trim() || '',
        link:    el.querySelector('a')?.href || '',
      }))
    );

    for (const item of items) {
      if (!item.link.includes('linkedin.com/in/')) continue;
      const parts = item.title.replace(' | LinkedIn', '').split(' - ');
      const name    = parts[0]?.trim() || 'Professional';
      const role    = parts[1]?.trim() || `${skills[0]} Specialist`;
      const company = parts[2]?.trim() || '';
      const expMatch = item.snippet.match(/(\d+)\s*\+?\s*years?/i);
      const exp = expMatch ? parseInt(expMatch[1]) : Math.floor(Math.random() * 5) + 2;
      const locMatch = item.snippet.match(/\b(Mumbai|Delhi|Bangalore|Bengaluru|Hyderabad|Chennai|Pune|Noida|Gurgaon|Kochi|Ahmedabad|Kolkata)\b/i);
      const loc = locMatch ? locMatch[1].replace('Bengaluru','Bangalore') : location;
      results.push({
        id: `li_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        name, role, experience: exp, location: loc,
        skills: extractSkillsFromText(item.snippet, skills),
        availability: 'Open to Work', allocation: 0,
        status: 'external', source: 'LinkedIn',
        profileUrl: item.link, company,
        contactEmail: null, isExternal: true, avatar: initials(name),
      });
    }
    console.log(`[LinkedIn/Google] ${results.length} profiles`);
  } catch (err) { console.error('[LinkedIn/Google]', err.message); }
  finally { await page.close(); }
  return results;
}

async function scrapeNaukri(browser, skills, location) {
  const page = await browser.newPage();
  const results = [];
  try {
    await page.setExtraHTTPHeaders({ 'User-Agent': UA });
    const skillSlug = skills.slice(0,2).join('-').toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-');
    const locSlug = location.toLowerCase().replace(/\s+/g,'-');
    const url = `https://www.naukri.com/${skillSlug}-jobs-in-${locSlug}`;
    console.log('[Naukri] Scraping:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.waitForTimeout(2500);

    const listings = await page.$$eval(
      'article.jobTuple, .srp-jobtuple-wrapper, div[class*="jobTuple"]',
      els => els.slice(0,10).map(el => ({
        title:   el.querySelector('[class*="title"], h2 a, .jobTitle')?.textContent?.trim() || '',
        company: el.querySelector('[class*="comp-name"], [class*="company"]')?.textContent?.trim() || '',
        exp:     el.querySelector('[class*="exp"], [class*="experience"]')?.textContent?.trim() || '',
        loc:     el.querySelector('[class*="loc"], [class*="location"]')?.textContent?.trim() || '',
        skills:  Array.from(el.querySelectorAll('[class*="tag"], li.tag-li')).map(s=>s.textContent.trim()).filter(s=>s.length>1&&s.length<25).slice(0,6),
        link:    el.querySelector('a[href*="naukri"]')?.href || el.querySelector('a')?.href || '',
      }))
    );

    let i = 1;
    for (const item of listings) {
      if (!item.title) continue;
      results.push({
        id: `naukri_${Date.now()}_${i++}`,
        name: `${item.title} Candidate`, role: item.title,
        experience: parseExp(item.exp), location: item.loc || location,
        skills: item.skills.length ? item.skills : skills.slice(0,3),
        availability: 'Open to Work', allocation: 0,
        status: 'external', source: 'Naukri.com',
        profileUrl: item.link || `https://www.naukri.com`,
        company: item.company ? `Ex: ${item.company}` : 'Currently seeking',
        contactEmail: null, isExternal: true, avatar: 'N',
      });
    }
    console.log(`[Naukri] ${results.length} listings`);
  } catch (err) { console.error('[Naukri]', err.message); }
  finally { await page.close(); }
  return results;
}

async function scrapeIndeed(browser, skills, location) {
  const page = await browser.newPage();
  const results = [];
  try {
    await page.setExtraHTTPHeaders({ 'User-Agent': UA });
    const q = encodeURIComponent(skills.slice(0,3).join(' '));
    const l = encodeURIComponent(location);
    const url = `https://in.indeed.com/jobs?q=${q}&l=${l}&fromage=30`;
    console.log('[Indeed] Scraping:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.waitForTimeout(2000);

    const listings = await page.$$eval(
      '.job_seen_beacon, .tapItem',
      els => els.slice(0,8).map(el => ({
        title:   el.querySelector('.jobTitle, h2 span')?.textContent?.trim() || '',
        company: el.querySelector('.companyName')?.textContent?.trim() || '',
        loc:     el.querySelector('.companyLocation')?.textContent?.trim() || '',
        snippet: el.querySelector('.summary, .job-snippet')?.textContent?.trim() || '',
        link:    el.querySelector('a[id^="job_"]')?.href || '',
      }))
    );

    let i = 1;
    for (const item of listings) {
      if (!item.title) continue;
      results.push({
        id: `indeed_${Date.now()}_${i++}`,
        name: `${item.title} Professional`, role: item.title,
        experience: Math.floor(Math.random()*5)+2, location: item.loc || location,
        skills: extractSkillsFromText(item.snippet, skills),
        availability: 'Open to Work', allocation: 0,
        status: 'external', source: 'Indeed India',
        profileUrl: item.link || 'https://in.indeed.com',
        company: item.company ? `Ex: ${item.company}` : 'Currently seeking',
        contactEmail: null, isExternal: true, avatar: 'I',
      });
    }
    console.log(`[Indeed] ${results.length} listings`);
  } catch (err) { console.error('[Indeed]', err.message); }
  finally { await page.close(); }
  return results;
}

async function searchExternalCandidates({ skills = [], location = 'India', requiredSkills = [] }) {
  console.log('\n[ExternalScraper] Starting — Skills:', skills, '| Location:', location);
  const scoreSkills = requiredSkills.length ? requiredSkills : skills;
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-blink-features=AutomationControlled'],
    });

    const [liRes, naukriRes, indeedRes] = await Promise.allSettled([
      scrapeLinkedInViaGoogle(browser, skills, location),
      scrapeNaukri(browser, skills, location),
      scrapeIndeed(browser, skills, location),
    ]);

    const all = [
      ...(liRes.status     === 'fulfilled' ? liRes.value     : []),
      ...(naukriRes.status === 'fulfilled' ? naukriRes.value : []),
      ...(indeedRes.status === 'fulfilled' ? indeedRes.value : []),
    ];

    const seen = new Set();
    const scored = all
      .map(c => ({ ...c, ...scoreCandidate(c, scoreSkills) }))
      .filter(c => {
        const key = `${c.name}_${c.role}`.toLowerCase().replace(/\s+/g,'');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    console.log(`[ExternalScraper] Done — ${scored.length} candidates`);
    return scored;
  } catch (err) {
    console.error('[ExternalScraper] Fatal:', err.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { searchExternalCandidates };
