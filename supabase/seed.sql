-- DuckSupport seed data (matches lib/seed.ts)

INSERT INTO users (id, name, initials, role, online) VALUES
  ('00000000-0000-0000-0000-000000000001', 'H. Nakae',      'HN', 'manager',   TRUE),
  ('00000000-0000-0000-0000-000000000002', 'N. Gilliland',  'NG', 'navigator', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'R. Nystrom',    'RN', 'navigator', FALSE),
  ('00000000-0000-0000-0000-000000000004', 'H. Ramos',      'HR', 'navigator', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO resources (id, name, kind, unit, stock, capacity, threshold, location, trend_delta) VALUES
  ('r-pantry-shelf', 'Food Pantry — Shelf Stable',  'physical', 'lbs',    412,   1200,  300,  'EMU Basement',       -34),
  ('r-pantry-fresh', 'Food Pantry — Fresh/Produce', 'physical', 'lbs',    88,    400,   120,  'EMU Basement',       -22),
  ('r-hygiene',      'Hygiene Kits',                'physical', 'kits',   47,    200,   40,   'Basic Needs Office', -6),
  ('r-bus',          'LTD Bus Day-Passes',          'physical', 'passes', 18,    100,   25,   'Front Desk',         -7),
  ('r-housing',      'Emergency Housing Fund',      'fund',     'USD',    4200,  50000, 5000, 'Care Team Ledger',   -1800),
  ('r-grant',        'Crisis Micro-Grants',         'fund',     'USD',    12450, 30000, 6000, 'Care Team Ledger',   -640),
  ('r-childcare',    'Childcare Voucher Fund',      'fund',     'USD',    7800,  15000, 3000, 'Care Team Ledger',   -210),
  ('r-textbook',     'Textbook Lending Pool',       'physical', 'titles', 64,    200,   30,   'Knight Library',     4)
ON CONFLICT DO NOTHING;

INSERT INTO referrals (id, student_name, pronouns, program, need, stage, urgency, opened_at, navigator_id, notes) VALUES
  ('DS-2841', 'Mira Okafor',      'she/her',   'CHC Sophomore',     'Food + bus pass',     'intake',   'high', NOW() - INTERVAL '14 minutes', '00000000-0000-0000-0000-000000000001', 'Lost off-campus housing, sleeping at friend''s couch.'),
  ('DS-2840', 'Jordan Reyes',     'they/them', 'PhD Linguistics',   'Childcare voucher',   'intake',   'med',  NOW() - INTERVAL '42 minutes', '00000000-0000-0000-0000-000000000001', 'Partner working night shift; needs Tues/Thurs PM coverage.'),
  ('DS-2839', 'Annika Bjornson',  'she/her',   'Junior, SOJC',      'Hygiene + produce',   'verified', 'low',  NOW() - INTERVAL '95 minutes', '00000000-0000-0000-0000-000000000002', ''),
  ('DS-2838', 'Cole Pemberton',   'he/him',    'Freshman, CAS',     'Housing fund',        'verified', 'high', NOW() - INTERVAL '1 day',      '00000000-0000-0000-0000-000000000001', 'Eviction notice dated 5/20.'),
  ('DS-2836', 'Wen Liu',          'she/her',   'Senior, CoD',       'Crisis micro-grant',  'matched',  'med',  NOW() - INTERVAL '1 day',      '00000000-0000-0000-0000-000000000003', 'Car repair to commute from Springfield.'),
  ('DS-2834', 'Diego Salvatierra','he/him',    'Grad, COE',         'Textbook + bus pass', 'matched',  'low',  NOW() - INTERVAL '2 days',     '00000000-0000-0000-0000-000000000001', ''),
  ('DS-2829', 'Hannah Eklund',    'she/her',   'Sophomore, CAS',    'Pantry — fresh',      'acquired', 'med',  NOW() - INTERVAL '3 days',     '00000000-0000-0000-0000-000000000001', ''),
  ('DS-2827', 'Tobias Wren',      'he/him',    'Junior, Lundquist', 'Housing fund',        'acquired', 'high', NOW() - INTERVAL '4 days',     '00000000-0000-0000-0000-000000000002', 'Bridge funding approved.'),
  ('DS-2820', 'Priya Ramanathan', 'she/her',   'PhD Bio',           'Childcare',           'closed',   'low',  NOW() - INTERVAL '7 days',     '00000000-0000-0000-0000-000000000003', 'Closed — referred to community partner.'),
  ('DS-2818', 'Marcus Holloway',  'he/him',    'Senior, CAS',       'Pantry shelf-stable', 'closed',   'low',  NOW() - INTERVAL '8 days',     '00000000-0000-0000-0000-000000000001', '')
ON CONFLICT DO NOTHING;

INSERT INTO referral_resources (referral_id, resource_id) VALUES
  ('DS-2841', 'r-pantry-shelf'), ('DS-2841', 'r-bus'),
  ('DS-2840', 'r-childcare'),
  ('DS-2839', 'r-hygiene'),      ('DS-2839', 'r-pantry-fresh'),
  ('DS-2838', 'r-housing'),
  ('DS-2836', 'r-grant'),
  ('DS-2834', 'r-textbook'),     ('DS-2834', 'r-bus'),
  ('DS-2829', 'r-pantry-fresh'),
  ('DS-2827', 'r-housing'),
  ('DS-2820', 'r-childcare'),
  ('DS-2818', 'r-pantry-shelf')
ON CONFLICT DO NOTHING;

INSERT INTO alerts (id, severity, resource_id, message, created_at) VALUES
  ('al-1', 'crit', 'r-bus',          'LTD Bus Day-Passes below threshold (18 / 25).',       NOW() - INTERVAL '8 minutes'),
  ('al-2', 'warn', 'r-pantry-fresh', 'Fresh Produce approaching threshold (88 / 120 lbs).', NOW() - INTERVAL '24 minutes'),
  ('al-3', 'warn', 'r-housing',      'Emergency Housing Fund at 8.4% of capacity.',         NOW() - INTERVAL '46 minutes'),
  ('al-4', 'info', 'r-pantry-shelf', 'Donation logged: +45 lbs shelf-stable goods.',        NOW() - INTERVAL '11 minutes')
ON CONFLICT DO NOTHING;
