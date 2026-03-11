-- ═══════════════════════════════════════════════════════════════
-- Resource Intelligence AI — PostgreSQL Schema
-- ═══════════════════════════════════════════════════════════════

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id                   SERIAL PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  email                VARCHAR(150) UNIQUE,
  role                 VARCHAR(150),
  experience_years     INTEGER DEFAULT 0,
  availability_status  VARCHAR(20) DEFAULT 'available'  -- available | partial | busy | unavailable
                         CHECK (availability_status IN ('available', 'partial', 'busy', 'unavailable')),
  allocation_percentage INTEGER DEFAULT 0               -- 0-100
                         CHECK (allocation_percentage BETWEEN 0 AND 100),
  location             VARCHAR(100),
  avatar_initials      VARCHAR(5),
  rating               NUMERIC(3,1) DEFAULT 0,
  is_active            BOOLEAN DEFAULT TRUE,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW()
);

-- Skills (normalized)
CREATE TABLE IF NOT EXISTS skills (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) UNIQUE NOT NULL,
  category   VARCHAR(50),          -- frontend | backend | cloud | data | mobile | security
  created_at TIMESTAMP DEFAULT NOW()
);

-- Candidate ↔ Skills (many-to-many)
CREATE TABLE IF NOT EXISTS candidate_skills (
  id            SERIAL PRIMARY KEY,
  candidate_id  INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
  skill_id      INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  proficiency   VARCHAR(20) DEFAULT 'intermediate',  -- beginner | intermediate | expert
  years         INTEGER DEFAULT 0,
  UNIQUE (candidate_id, skill_id)
);

-- Search Requests (from resource managers)
CREATE TABLE IF NOT EXISTS search_requests (
  id                 SERIAL PRIMARY KEY,
  title              VARCHAR(200),
  job_description    TEXT NOT NULL,
  requested_by       VARCHAR(100),
  status             VARCHAR(20) DEFAULT 'pending',  -- pending | processing | completed | failed
  extracted_skills   JSONB DEFAULT '[]',
  ai_summary         TEXT,
  ai_used            BOOLEAN DEFAULT FALSE,
  processing_time_ms INTEGER,
  created_at         TIMESTAMP DEFAULT NOW(),
  completed_at       TIMESTAMP
);

-- Ranked Results for each Search Request
CREATE TABLE IF NOT EXISTS search_results (
  id               SERIAL PRIMARY KEY,
  search_request_id INTEGER REFERENCES search_requests(id) ON DELETE CASCADE,
  candidate_id      INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
  rank              INTEGER,
  overall_score     INTEGER,
  skill_match_score INTEGER,
  experience_score  INTEGER,
  availability_score INTEGER,
  allocation_score  INTEGER,
  explanation       TEXT,
  skill_gaps        JSONB DEFAULT '[]',
  strengths         JSONB DEFAULT '[]',
  created_at        TIMESTAMP DEFAULT NOW()
);

-- Shortlisted Candidates
CREATE TABLE IF NOT EXISTS shortlisted_candidates (
  id                SERIAL PRIMARY KEY,
  search_request_id INTEGER REFERENCES search_requests(id) ON DELETE CASCADE,
  candidate_id      INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
  shortlisted_by    VARCHAR(100),
  stage             VARCHAR(30) DEFAULT 'shortlisted',  -- shortlisted | interviewing | allocated | rejected
  notes             TEXT,
  shortlisted_at    TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW(),
  UNIQUE (search_request_id, candidate_id)
);

-- Allocation Status
CREATE TABLE IF NOT EXISTS allocations (
  id                SERIAL PRIMARY KEY,
  candidate_id      INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
  project_name      VARCHAR(200),
  allocation_pct    INTEGER CHECK (allocation_pct BETWEEN 0 AND 100),
  start_date        DATE,
  end_date          DATE,
  allocated_by      VARCHAR(100),
  status            VARCHAR(20) DEFAULT 'active',  -- active | completed | cancelled
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ── Indexes ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(availability_status);
CREATE INDEX IF NOT EXISTS idx_candidates_active ON candidates(is_active);
CREATE INDEX IF NOT EXISTS idx_search_requests_status ON search_requests(status);
CREATE INDEX IF NOT EXISTS idx_search_results_request ON search_results(search_request_id);
CREATE INDEX IF NOT EXISTS idx_search_results_rank ON search_results(search_request_id, rank);
CREATE INDEX IF NOT EXISTS idx_shortlist_request ON shortlisted_candidates(search_request_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills ON candidate_skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_allocations_candidate ON allocations(candidate_id, status);

-- ── Seed Data ──────────────────────────────────────────────────────────────────
INSERT INTO skills (name, category) VALUES
  ('React', 'frontend'), ('TypeScript', 'frontend'), ('Vue.js', 'frontend'),
  ('Node.js', 'backend'), ('Python', 'backend'), ('Java', 'backend'),
  ('PostgreSQL', 'data'), ('MongoDB', 'data'), ('Redis', 'data'),
  ('AWS', 'cloud'), ('GCP', 'cloud'), ('Docker', 'cloud'), ('Kubernetes', 'cloud'),
  ('TensorFlow', 'ai'), ('PyTorch', 'ai'), ('LangChain', 'ai'), ('NLP', 'ai'),
  ('React Native', 'mobile'), ('iOS', 'mobile'), ('Android', 'mobile'),
  ('GraphQL', 'backend'), ('FastAPI', 'backend'), ('Spring Boot', 'backend'),
  ('Kafka', 'data'), ('Spark', 'data'), ('Airflow', 'data'),
  ('Terraform', 'cloud'), ('CI/CD', 'cloud'), ('Prometheus', 'cloud')
ON CONFLICT (name) DO NOTHING;

INSERT INTO candidates (name, email, role, experience_years, availability_status, allocation_percentage, location, avatar_initials, rating) VALUES
  ('Arjun Mehta',    'arjun@example.com',   'Senior Full Stack Engineer', 7, 'available', 0,   'Bangalore, India', 'AM', 4.8),
  ('Priya Sharma',   'priya@example.com',   'AI/ML Engineer',             5, 'partial',   40,  'Hyderabad, India', 'PS', 4.9),
  ('David Chen',     'david@example.com',   'DevOps / Cloud Architect',   9, 'busy',      80,  'Singapore',        'DC', 4.7),
  ('Sarah Williams', 'sarah@example.com',   'UX/Product Designer',        6, 'available', 0,   'London, UK',       'SW', 4.6),
  ('Rahul Verma',    'rahul@example.com',   'Backend Engineer',           4, 'available', 0,   'Pune, India',      'RV', 4.4),
  ('Lin Zhang',      'lin@example.com',     'Data Engineer',              6, 'available', 20,  'Shanghai, China',  'LZ', 4.7),
  ('Kavya Nair',     'kavya@example.com',   'React Native Developer',     3, 'available', 0,   'Kochi, India',     'KN', 4.3),
  ('Marcus Johnson', 'marcus@example.com',  'Security Engineer',          8, 'partial',   60,  'Austin, TX',       'MJ', 4.8)
ON CONFLICT (email) DO NOTHING;
