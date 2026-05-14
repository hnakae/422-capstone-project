import type { Resource, Referral, Alert, ActivityItem, TeamMember, StageInfo, DemandPoint } from './types'

const today = new Date('2026-05-13T10:14:00')
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return d.toISOString() }
const minsAgo = (n: number) => { const d = new Date(today); d.setMinutes(d.getMinutes() - n); return d.toISOString() }

export const STAGES: StageInfo[] = [
  { id: 'intake',   label: 'Intake',    hint: 'Newly submitted' },
  { id: 'verified', label: 'Verified',  hint: 'Eligibility confirmed' },
  { id: 'matched',  label: 'Matched',   hint: 'Resource assigned' },
  { id: 'acquired', label: 'Acquired',  hint: 'Student received' },
  { id: 'closed',   label: 'Closed',    hint: 'Case complete' },
]

export const RESOURCES: Resource[] = [
  { id: 'r-pantry-shelf', name: 'Food Pantry — Shelf Stable', kind: 'physical', unit: 'lbs',    stock: 412,   capacity: 1200,  threshold: 300,  location: 'EMU Basement',        trendDelta: -34 },
  { id: 'r-pantry-fresh', name: 'Food Pantry — Fresh/Produce', kind: 'physical', unit: 'lbs',   stock: 88,    capacity: 400,   threshold: 120,  location: 'EMU Basement',        trendDelta: -22 },
  { id: 'r-hygiene',      name: 'Hygiene Kits',                kind: 'physical', unit: 'kits',  stock: 47,    capacity: 200,   threshold: 40,   location: 'Basic Needs Office',  trendDelta: -6  },
  { id: 'r-bus',          name: 'LTD Bus Day-Passes',          kind: 'physical', unit: 'passes',stock: 18,    capacity: 100,   threshold: 25,   location: 'Front Desk',          trendDelta: -7  },
  { id: 'r-housing',      name: 'Emergency Housing Fund',      kind: 'fund',     unit: 'USD',   stock: 4200,  capacity: 50000, threshold: 5000, location: 'Care Team Ledger',    trendDelta: -1800},
  { id: 'r-grant',        name: 'Crisis Micro-Grants',         kind: 'fund',     unit: 'USD',   stock: 12450, capacity: 30000, threshold: 6000, location: 'Care Team Ledger',    trendDelta: -640 },
  { id: 'r-childcare',    name: 'Childcare Voucher Fund',      kind: 'fund',     unit: 'USD',   stock: 7800,  capacity: 15000, threshold: 3000, location: 'Care Team Ledger',    trendDelta: -210 },
  { id: 'r-textbook',     name: 'Textbook Lending Pool',       kind: 'physical', unit: 'titles',stock: 64,    capacity: 200,   threshold: 30,   location: 'Knight Library',      trendDelta: 4   },
]

export const REFERRALS: Referral[] = [
  { id: 'DS-2841', student: 'Mira Okafor',       pronouns: 'she/her',   program: 'CHC Sophomore',     need: 'Food + bus pass',     stage: 'intake',   urgency: 'high', opened: minsAgo(14), resources: ['r-pantry-shelf','r-bus'],          navigator: 'You',       notes: 'Lost off-campus housing, sleeping at friend’s couch.' },
  { id: 'DS-2840', student: 'Jordan Reyes',       pronouns: 'they/them', program: 'PhD Linguistics',   need: 'Childcare voucher',   stage: 'intake',   urgency: 'med',  opened: minsAgo(42), resources: ['r-childcare'],                      navigator: 'You',       notes: 'Partner working night shift; needs Tues/Thurs PM coverage.' },
  { id: 'DS-2839', student: 'Annika Bjornson',    pronouns: 'she/her',   program: 'Junior, SOJC',      need: 'Hygiene + produce',   stage: 'verified', urgency: 'low',  opened: minsAgo(95), resources: ['r-hygiene','r-pantry-fresh'],        navigator: 'M. Singh',  notes: '' },
  { id: 'DS-2838', student: 'Cole Pemberton',     pronouns: 'he/him',    program: 'Freshman, CAS',     need: 'Housing fund',        stage: 'verified', urgency: 'high', opened: daysAgo(1),  resources: ['r-housing'],                        navigator: 'You',       notes: 'Eviction notice dated 5/20.' },
  { id: 'DS-2836', student: 'Wen Liu',            pronouns: 'she/her',   program: 'Senior, CoD',       need: 'Crisis micro-grant',  stage: 'matched',  urgency: 'med',  opened: daysAgo(1),  resources: ['r-grant'],                          navigator: 'R. Mendez', notes: 'Car repair to commute from Springfield.' },
  { id: 'DS-2834', student: 'Diego Salvatierra',  pronouns: 'he/him',    program: 'Grad, COE',         need: 'Textbook + bus pass', stage: 'matched',  urgency: 'low',  opened: daysAgo(2),  resources: ['r-textbook','r-bus'],               navigator: 'You',       notes: '' },
  { id: 'DS-2829', student: 'Hannah Eklund',      pronouns: 'she/her',   program: 'Sophomore, CAS',    need: 'Pantry — fresh', stage: 'acquired', urgency: 'med',  opened: daysAgo(3),  resources: ['r-pantry-fresh'],                   navigator: 'You',       notes: '' },
  { id: 'DS-2827', student: 'Tobias Wren',        pronouns: 'he/him',    program: 'Junior, Lundquist', need: 'Housing fund',        stage: 'acquired', urgency: 'high', opened: daysAgo(4),  resources: ['r-housing'],                        navigator: 'M. Singh',  notes: 'Bridge funding approved.' },
  { id: 'DS-2820', student: 'Priya Ramanathan',   pronouns: 'she/her',   program: 'PhD Bio',           need: 'Childcare',           stage: 'closed',   urgency: 'low',  opened: daysAgo(7),  resources: ['r-childcare'],                      navigator: 'R. Mendez', notes: 'Closed — referred to community partner.' },
  { id: 'DS-2818', student: 'Marcus Holloway',    pronouns: 'he/him',    program: 'Senior, CAS',       need: 'Pantry shelf-stable', stage: 'closed',   urgency: 'low',  opened: daysAgo(8),  resources: ['r-pantry-shelf'],                   navigator: 'You',       notes: '' },
]

export const ALERTS: Alert[] = [
  { id: 'al-1', sev: 'crit', resource: 'r-bus',          msg: 'LTD Bus Day-Passes below threshold (18 / 25).',            t: minsAgo(8) },
  { id: 'al-2', sev: 'warn', resource: 'r-pantry-fresh', msg: 'Fresh Produce approaching threshold (88 / 120 lbs).',       t: minsAgo(24) },
  { id: 'al-3', sev: 'warn', resource: 'r-housing',      msg: 'Emergency Housing Fund at 8.4% of capacity.',              t: minsAgo(46) },
  { id: 'al-4', sev: 'info', resource: 'r-pantry-shelf', msg: 'Donation logged: +45 lbs shelf-stable goods.',             t: minsAgo(11) },
]

export const ACTIVITY: ActivityItem[] = [
  { id: 'a1', t: minsAgo(3),  who: 'You',       what: 'opened intake',   target: 'DS-2841 — Mira Okafor' },
  { id: 'a2', t: minsAgo(11), who: 'R. Mendez', what: 'logged donation', target: '+45 lbs to Food Pantry — Shelf Stable' },
  { id: 'a3', t: minsAgo(24), who: 'System',    what: 'threshold alert', target: 'Fresh Produce nearing 88/120 lbs' },
  { id: 'a4', t: minsAgo(37), who: 'M. Singh',  what: 'matched referral',target: 'DS-2838 → Emergency Housing Fund' },
  { id: 'a5', t: minsAgo(58), who: 'You',       what: 'closed case',     target: 'DS-2818 — pantry kit delivered' },
  { id: 'a6', t: minsAgo(72), who: 'System',    what: 'donation logged', target: '$1,200 grant from Eugene Rotary' },
]

export const TEAM: TeamMember[] = [
  { id: 'u1', name: 'You (N. Park)',   role: 'Navigator',           initials: 'NP', online: true },
  { id: 'u2', name: 'M. Singh',        role: 'Navigator',           initials: 'MS', online: true },
  { id: 'u3', name: 'R. Mendez',       role: 'Navigator',           initials: 'RM', online: false },
  { id: 'u4', name: 'Dr. K. Whitlow', role: 'Care Team Manager',   initials: 'KW', online: true },
]

export const DEMAND_SERIES: DemandPoint[] = [
  { day: '4/30', food: 18, housing: 4,  fund: 6,  hygiene: 7  },
  { day: '5/01', food: 22, housing: 5,  fund: 8,  hygiene: 9  },
  { day: '5/02', food: 14, housing: 3,  fund: 5,  hygiene: 6  },
  { day: '5/03', food: 9,  housing: 2,  fund: 3,  hygiene: 4  },
  { day: '5/04', food: 25, housing: 6,  fund: 9,  hygiene: 8  },
  { day: '5/05', food: 28, housing: 8,  fund: 11, hygiene: 10 },
  { day: '5/06', food: 24, housing: 5,  fund: 7,  hygiene: 9  },
  { day: '5/07', food: 30, housing: 7,  fund: 10, hygiene: 11 },
  { day: '5/08', food: 27, housing: 9,  fund: 12, hygiene: 9  },
  { day: '5/09', food: 21, housing: 6,  fund: 8,  hygiene: 7  },
  { day: '5/10', food: 16, housing: 4,  fund: 6,  hygiene: 5  },
  { day: '5/11', food: 32, housing: 11, fund: 14, hygiene: 12 },
  { day: '5/12', food: 35, housing: 13, fund: 15, hygiene: 13 },
  { day: '5/13', food: 19, housing: 7,  fund: 9,  hygiene: 6  },
]
