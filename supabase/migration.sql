-- DuckSupport schema

CREATE TABLE IF NOT EXISTS users (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT,
  initials  CHAR(2),
  role      TEXT CHECK (role IN ('navigator', 'manager')),
  online    BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS resources (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  kind        TEXT CHECK (kind IN ('physical', 'fund')),
  unit        TEXT,
  stock       NUMERIC NOT NULL DEFAULT 0,
  capacity    NUMERIC NOT NULL,
  threshold   NUMERIC NOT NULL DEFAULT 0,
  location    TEXT,
  trend_delta NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS referrals (
  id           TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  pronouns     TEXT,
  program      TEXT,
  need         TEXT,
  stage        TEXT CHECK (stage IN ('intake','verified','matched','acquired','closed')) DEFAULT 'intake',
  urgency      TEXT CHECK (urgency IN ('high','med','low')) DEFAULT 'med',
  opened_at    TIMESTAMPTZ DEFAULT NOW(),
  navigator_id UUID REFERENCES users(id),
  notes        TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS referral_resources (
  referral_id TEXT REFERENCES referrals(id) ON DELETE CASCADE,
  resource_id TEXT REFERENCES resources(id) ON DELETE CASCADE,
  PRIMARY KEY (referral_id, resource_id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id           TEXT PRIMARY KEY,
  severity     TEXT CHECK (severity IN ('crit','warn','info')),
  resource_id  TEXT REFERENCES resources(id),
  message      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  dismissed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS activity (
  id         TEXT PRIMARY KEY,
  actor_id   UUID REFERENCES users(id),
  verb       TEXT,
  target     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
