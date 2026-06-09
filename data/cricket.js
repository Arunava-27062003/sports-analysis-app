// ─── Format definitions ───────────────────────────────────────────────────────

export const FORMATS = [
  { id: 'ipl',  label: 'IPL',  color: '#EC1C24' },
  { id: 'test', label: 'Test', color: '#8B1A1A' },
  { id: 'odi',  label: 'ODI',  color: '#1A3A8B' },
  { id: 't20i', label: 'T20I', color: '#5C1A8B' },
];

// ─── Team colour palettes ─────────────────────────────────────────────────────

const T = {
  RCB:  { id: 'rcb',  name: 'Royal Challengers Bengaluru', short: 'RCB',  color: '#EC1C24' },
  PBKS: { id: 'pbks', name: 'Punjab Kings',                short: 'PBKS', color: '#A4262C' },
  GT:   { id: 'gt',   name: 'Gujarat Titans',              short: 'GT',   color: '#1B2133' },
  MI:   { id: 'mi',   name: 'Mumbai Indians',              short: 'MI',   color: '#004BA0' },
  DC:   { id: 'dc',   name: 'Delhi Capitals',              short: 'DC',   color: '#17479E' },
  CSK:  { id: 'csk',  name: 'Chennai Super Kings',         short: 'CSK',  color: '#D4A017' },
  KKR:  { id: 'kkr',  name: 'Kolkata Knight Riders',       short: 'KKR',  color: '#3A225D' },
  SRH:  { id: 'srh',  name: 'Sunrisers Hyderabad',         short: 'SRH',  color: '#E05A10' },
  RR:   { id: 'rr',   name: 'Rajasthan Royals',            short: 'RR',   color: '#C0176E' },
  LSG:  { id: 'lsg',  name: 'Lucknow Super Giants',        short: 'LSG',  color: '#A72056' },
};

const I = {
  IND: { id: 'ind', name: 'India',        short: 'IND', color: '#003580' },
  AUS: { id: 'aus', name: 'Australia',    short: 'AUS', color: '#B5831B' },
  ENG: { id: 'eng', name: 'England',      short: 'ENG', color: '#002D62' },
  NZ:  { id: 'nz',  name: 'New Zealand',  short: 'NZ',  color: '#1B1B1B' },
  SA:  { id: 'sa',  name: 'South Africa', short: 'SA',  color: '#007749' },
  PAK: { id: 'pak', name: 'Pakistan',     short: 'PAK', color: '#014421' },
  SL:  { id: 'sl',  name: 'Sri Lanka',    short: 'SL',  color: '#003478' },
  WI:  { id: 'wi',  name: 'West Indies',  short: 'WI',  color: '#7B0041' },
  BAN: { id: 'ban', name: 'Bangladesh',   short: 'BAN', color: '#006A4E' },
  AFG: { id: 'afg', name: 'Afghanistan',  short: 'AFG', color: '#002868' },
};

// ─── IPL 2026 ─────────────────────────────────────────────────────────────────

const iplMatches = [
  {
    id: 'ipl26_final',
    matchNumber: 'Final',
    format: 'T20',
    tournament: 'IPL 2026',
    venue: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    date: '2026-05-31',
    status: 'completed',
    team1: T.GT,
    team2: T.RCB,
    innings1: {
      teamId: 'gt', teamShort: 'GT', teamColor: '#1B2133',
      totalRuns: 155, wickets: 8, overs: '20.0', extras: 9,
      batting: [
        { playerName: 'Shubman Gill',       runs: 58, balls: 42, fours: 6, sixes: 2, strikeRate: 138.1, dismissal: 'c Kohli b Bhuvneshwar' },
        { playerName: 'Sai Sudharsan',      runs: 42, balls: 35, fours: 4, sixes: 1, strikeRate: 120.0, dismissal: 'b Jofra Archer' },
        { playerName: 'Sherfane Rutherford',runs: 26, balls: 15, fours: 2, sixes: 2, strikeRate: 173.3, dismissal: 'c Patidar b Bhuvneshwar' },
      ],
      bowling: [
        { playerName: 'Bhuvneshwar Kumar', overs: 4, maidens: 0, runs: 28, wickets: 3, economy: 7.0  },
        { playerName: 'Jofra Archer',      overs: 4, maidens: 0, runs: 32, wickets: 2, economy: 8.0  },
        { playerName: 'Krunal Pandya',     overs: 4, maidens: 0, runs: 34, wickets: 2, economy: 8.5  },
        { playerName: 'Yash Dayal',        overs: 4, maidens: 0, runs: 38, wickets: 1, economy: 9.5  },
      ],
    },
    innings2: {
      teamId: 'rcb', teamShort: 'RCB', teamColor: '#EC1C24',
      totalRuns: 161, wickets: 5, overs: '18.0', extras: 11,
      batting: [
        { playerName: 'Virat Kohli',    runs: 75, balls: 54, fours: 8, sixes: 2, strikeRate: 138.9, dismissal: 'not out' },
        { playerName: 'Phil Salt',      runs: 42, balls: 25, fours: 5, sixes: 2, strikeRate: 168.0, dismissal: 'b Rashid Khan' },
        { playerName: 'Rajat Patidar', runs: 24, balls: 17, fours: 2, sixes: 1, strikeRate: 141.2, dismissal: 'b Rashid Khan' },
      ],
      bowling: [
        { playerName: 'Rashid Khan',     overs: 4, maidens: 0, runs: 22, wickets: 2, economy: 5.5  },
        { playerName: 'Kagiso Rabada',   overs: 4, maidens: 0, runs: 38, wickets: 2, economy: 9.5  },
        { playerName: 'Noor Ahmad',      overs: 4, maidens: 0, runs: 42, wickets: 1, economy: 10.5 },
        { playerName: 'Prasidh Krishna', overs: 4, maidens: 0, runs: 36, wickets: 0, economy: 9.0  },
      ],
    },
    result: 'RCB won by 5 wickets',
    winner: 'RCB',
    manOfMatch: 'Virat Kohli',
    note: 'RCB are back-to-back IPL champions. Kohli 75* guides the chase.',
  },
  {
    id: 'ipl26_q2',
    matchNumber: 'Qualifier 2',
    format: 'T20',
    tournament: 'IPL 2026',
    venue: 'Eden Gardens',
    city: 'Kolkata',
    date: '2026-05-29',
    status: 'completed',
    team1: T.RR,
    team2: T.GT,
    innings1: {
      teamId: 'rr', teamShort: 'RR', teamColor: '#C0176E',
      totalRuns: 214, wickets: 6, overs: '20.0', extras: 12,
      batting: [
        { playerName: 'Vaibhav Sooryavanshi', runs: 72, balls: 34, fours: 7, sixes: 5, strikeRate: 211.8, dismissal: 'c Sudharsan b Rabada' },
        { playerName: 'Yashasvi Jaiswal',     runs: 56, balls: 38, fours: 6, sixes: 2, strikeRate: 147.4, dismissal: 'b Prasidh' },
        { playerName: 'Riyan Parag',          runs: 48, balls: 30, fours: 4, sixes: 2, strikeRate: 160.0, dismissal: 'not out' },
      ],
      bowling: [
        { playerName: 'Kagiso Rabada',   overs: 4, maidens: 0, runs: 36, wickets: 2, economy: 9.0  },
        { playerName: 'Prasidh Krishna', overs: 4, maidens: 0, runs: 42, wickets: 2, economy: 10.5 },
        { playerName: 'Rashid Khan',     overs: 4, maidens: 0, runs: 28, wickets: 1, economy: 7.0  },
        { playerName: 'Noor Ahmad',      overs: 4, maidens: 0, runs: 54, wickets: 1, economy: 13.5 },
      ],
    },
    innings2: {
      teamId: 'gt', teamShort: 'GT', teamColor: '#1B2133',
      totalRuns: 219, wickets: 3, overs: '18.2', extras: 8,
      batting: [
        { playerName: 'Shubman Gill',  runs: 104, balls: 55, fours: 10, sixes: 5, strikeRate: 189.1, dismissal: 'not out' },
        { playerName: 'Sai Sudharsan', runs: 62,  balls: 40, fours: 6,  sixes: 2, strikeRate: 155.0, dismissal: 'c Jaiswal b Archer' },
        { playerName: 'Jos Buttler',   runs: 38,  balls: 24, fours: 4,  sixes: 1, strikeRate: 158.3, dismissal: 'b Chahal' },
      ],
      bowling: [
        { playerName: 'Jofra Archer',        overs: 4,   maidens: 0, runs: 38, wickets: 2, economy: 9.5  },
        { playerName: 'Yuzvendra Chahal',    overs: 4,   maidens: 0, runs: 32, wickets: 1, economy: 8.0  },
        { playerName: 'Trent Boult',         overs: 3.2, maidens: 0, runs: 44, wickets: 0, economy: 13.2 },
        { playerName: 'Ravichandran Ashwin', overs: 4,   maidens: 0, runs: 38, wickets: 0, economy: 9.5  },
      ],
    },
    result: 'GT won by 7 wickets',
    winner: 'GT',
    manOfMatch: 'Shubman Gill',
    note: 'Gill century (104*) powers GT into the final.',
  },
  {
    id: 'ipl26_elim',
    matchNumber: 'Eliminator',
    format: 'T20',
    tournament: 'IPL 2026',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    date: '2026-05-27',
    status: 'completed',
    team1: T.RR,
    team2: T.SRH,
    innings1: {
      teamId: 'rr', teamShort: 'RR', teamColor: '#C0176E',
      totalRuns: 243, wickets: 8, overs: '20.0', extras: 14,
      batting: [
        { playerName: 'Vaibhav Sooryavanshi', runs: 88, balls: 38, fours: 8, sixes: 7, strikeRate: 231.6, dismissal: 'c Klaasen b Cummins' },
        { playerName: 'Riyan Parag',          runs: 65, balls: 38, fours: 6, sixes: 3, strikeRate: 171.1, dismissal: 'not out' },
        { playerName: 'Yashasvi Jaiswal',     runs: 44, balls: 30, fours: 4, sixes: 2, strikeRate: 146.7, dismissal: 'b Bhuvneshwar' },
      ],
      bowling: [
        { playerName: 'Pat Cummins',       overs: 4, maidens: 0, runs: 38, wickets: 3, economy: 9.5  },
        { playerName: 'Bhuvneshwar Kumar', overs: 4, maidens: 0, runs: 34, wickets: 2, economy: 8.5  },
        { playerName: 'T Natarajan',       overs: 4, maidens: 0, runs: 58, wickets: 2, economy: 14.5 },
        { playerName: 'Harshal Patel',     overs: 4, maidens: 0, runs: 64, wickets: 0, economy: 16.0 },
      ],
    },
    innings2: {
      teamId: 'srh', teamShort: 'SRH', teamColor: '#E05A10',
      totalRuns: 196, wickets: 10, overs: '19.1', extras: 10,
      batting: [
        { playerName: 'Heinrich Klaasen', runs: 68, balls: 40, fours: 5, sixes: 4, strikeRate: 170.0, dismissal: 'c Parag b Archer' },
        { playerName: 'Travis Head',      runs: 44, balls: 29, fours: 4, sixes: 2, strikeRate: 151.7, dismissal: 'c Jaiswal b Boult' },
        { playerName: 'Abhishek Sharma',  runs: 38, balls: 22, fours: 4, sixes: 2, strikeRate: 172.7, dismissal: 'b Kuldip Sen' },
      ],
      bowling: [
        { playerName: 'Jofra Archer',       overs: 4,   maidens: 0, runs: 32, wickets: 3, economy: 8.0  },
        { playerName: 'Trent Boult',        overs: 3.1, maidens: 0, runs: 28, wickets: 2, economy: 8.84 },
        { playerName: 'Yuzvendra Chahal',   overs: 4,   maidens: 0, runs: 38, wickets: 2, economy: 9.5  },
        { playerName: 'Ravichandran Ashwin',overs: 4,   maidens: 0, runs: 48, wickets: 2, economy: 12.0 },
      ],
    },
    result: 'RR won by 47 runs',
    winner: 'RR',
    manOfMatch: 'Vaibhav Sooryavanshi',
    note: 'Sooryavanshi (age 15) smashes 88 off 38. RR advance to Qualifier 2.',
  },
];

const iplPlayers = [
  {
    id: 'sooryavanshi', name: 'Vaibhav Sooryavanshi', team: 'Rajasthan Royals', teamShort: 'RR', teamColor: '#C0176E',
    role: 'batsman', matches: 16,
    batting: { innings: 16, runs: 776, average: 48.5, strikeRate: 237.3, hundreds: 1, fifties: 5, highScore: 105 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'gill_ipl26', name: 'Shubman Gill', team: 'Gujarat Titans', teamShort: 'GT', teamColor: '#1B2133',
    role: 'batsman', matches: 16,
    batting: { innings: 15, runs: 732, average: 54.5, strikeRate: 163.0, hundreds: 2, fifties: 4, highScore: 116 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'sudharsan_ipl26', name: 'Sai Sudharsan', team: 'Gujarat Titans', teamShort: 'GT', teamColor: '#1B2133',
    role: 'batsman', matches: 16,
    batting: { innings: 15, runs: 722, average: 53.5, strikeRate: 158.0, hundreds: 1, fifties: 5, highScore: 108 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'kohli_ipl26', name: 'Virat Kohli', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', teamColor: '#EC1C24',
    role: 'batsman', matches: 16,
    batting: { innings: 15, runs: 675, average: 56.3, strikeRate: 165.8, hundreds: 1, fifties: 5, highScore: 93 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'klaasen_ipl26', name: 'Heinrich Klaasen', team: 'Sunrisers Hyderabad', teamShort: 'SRH', teamColor: '#E05A10',
    role: 'wicketkeeper', matches: 15,
    batting: { innings: 14, runs: 624, average: 52.0, strikeRate: 160.0, hundreds: 1, fifties: 4, highScore: 97 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'rabada_ipl26', name: 'Kagiso Rabada', team: 'Gujarat Titans', teamShort: 'GT', teamColor: '#1B2133',
    role: 'bowler', matches: 16,
    batting: { innings: 4, runs: 18, average: 4.5, strikeRate: 75.0, hundreds: 0, fifties: 0, highScore: 12 },
    bowling: { innings: 16, wickets: 29, economy: 9.68, average: 21.6, bestBowling: '4/26' },
  },
  {
    id: 'bhuvi_ipl26', name: 'Bhuvneshwar Kumar', team: 'Royal Challengers Bengaluru', teamShort: 'RCB', teamColor: '#EC1C24',
    role: 'bowler', matches: 16,
    batting: { innings: 3, runs: 8, average: 2.7, strikeRate: 66.7, hundreds: 0, fifties: 0, highScore: 5 },
    bowling: { innings: 16, wickets: 28, economy: 7.95, average: 18.4, bestBowling: '4/18' },
  },
  {
    id: 'archer_ipl26', name: 'Jofra Archer', team: 'Rajasthan Royals', teamShort: 'RR', teamColor: '#C0176E',
    role: 'bowler', matches: 14,
    batting: { innings: 3, runs: 12, average: 4.0, strikeRate: 80.0, hundreds: 0, fifties: 0, highScore: 9 },
    bowling: { innings: 14, wickets: 25, economy: 8.4, average: 22.9, bestBowling: '4/24' },
  },
  {
    id: 'rashid_ipl26', name: 'Rashid Khan', team: 'Gujarat Titans', teamShort: 'GT', teamColor: '#1B2133',
    role: 'bowler', matches: 16,
    batting: { innings: 8, runs: 78, average: 13.0, strikeRate: 132.2, hundreds: 0, fifties: 0, highScore: 34 },
    bowling: { innings: 16, wickets: 21, economy: 7.2, average: 20.8, bestBowling: '4/18' },
  },
  {
    id: 'kamboj_ipl26', name: 'Anshul Kamboj', team: 'Chennai Super Kings', teamShort: 'CSK', teamColor: '#D4A017',
    role: 'bowler', matches: 15,
    batting: { innings: 4, runs: 14, average: 3.5, strikeRate: 70.0, hundreds: 0, fifties: 0, highScore: 8 },
    bowling: { innings: 15, wickets: 21, economy: 8.6, average: 22.4, bestBowling: '4/32' },
  },
];

const iplStandings = [
  { id: 'rcb',  name: 'Royal Challengers Bengaluru', shortName: 'RCB',  color: '#EC1C24', matches: 14, won: 9, lost: 5, noResult: 0, points: 18, nrr:  0.783, form: ['W','W','L','W','W'] },
  { id: 'gt',   name: 'Gujarat Titans',              shortName: 'GT',   color: '#1B2133', matches: 14, won: 9, lost: 5, noResult: 0, points: 18, nrr:  0.695, form: ['W','W','W','L','W'] },
  { id: 'srh',  name: 'Sunrisers Hyderabad',         shortName: 'SRH',  color: '#E05A10', matches: 14, won: 9, lost: 5, noResult: 0, points: 18, nrr:  0.524, form: ['W','L','W','W','L'] },
  { id: 'rr',   name: 'Rajasthan Royals',            shortName: 'RR',   color: '#C0176E', matches: 14, won: 8, lost: 6, noResult: 0, points: 16, nrr:  0.189, form: ['W','W','L','W','W'] },
  { id: 'pbks', name: 'Punjab Kings',                shortName: 'PBKS', color: '#A4262C', matches: 14, won: 7, lost: 6, noResult: 1, points: 15, nrr:  0.309, form: ['W','L','W','W','L'] },
  { id: 'dc',   name: 'Delhi Capitals',              shortName: 'DC',   color: '#17479E', matches: 14, won: 7, lost: 7, noResult: 0, points: 14, nrr: -0.651, form: ['L','W','L','W','L'] },
  { id: 'kkr',  name: 'Kolkata Knight Riders',       shortName: 'KKR',  color: '#3A225D', matches: 14, won: 6, lost: 7, noResult: 1, points: 13, nrr: -0.147, form: ['W','L','L','W','L'] },
  { id: 'csk',  name: 'Chennai Super Kings',         shortName: 'CSK',  color: '#D4A017', matches: 14, won: 6, lost: 8, noResult: 0, points: 12, nrr: -0.345, form: ['L','L','W','L','W'] },
  { id: 'mi',   name: 'Mumbai Indians',              shortName: 'MI',   color: '#004BA0', matches: 14, won: 4, lost: 10, noResult: 0, points: 8,  nrr: -0.584, form: ['L','W','L','L','L'] },
  { id: 'lsg',  name: 'Lucknow Super Giants',        shortName: 'LSG',  color: '#A72056', matches: 14, won: 4, lost: 10, noResult: 0, points: 8,  nrr: -0.740, form: ['L','L','L','W','L'] },
];

// ─── Test Cricket ─────────────────────────────────────────────────────────────

const testMatches = [
  {
    id: 'test_ashes25_5',
    matchNumber: '5th Test',
    format: 'Test',
    isTest: true,
    tournament: 'Anderson-Tendulkar Trophy 2025',
    venue: 'The Oval',
    city: 'London',
    date: '2025-08-07',
    status: 'completed',
    team1: I.ENG,
    team2: I.IND,
    innings1: {
      teamId: 'eng', teamShort: 'ENG', teamColor: '#002D62',
      testScore: '395 & 237',
      totalRuns: 237, wickets: 10, overs: '74.3',
    },
    innings2: {
      teamId: 'ind', teamShort: 'IND', teamColor: '#003580',
      testScore: '387 & 249/4',
      totalRuns: 249, wickets: 4, overs: '78.2',
    },
    result: 'India won by 6 wickets',
    winner: 'IND',
    manOfMatch: 'Jasprit Bumrah',
    seriesResult: 'Series drawn 2–2 · India retain Trophy',
  },
  {
    id: 'test_ashes25_1',
    matchNumber: '1st Test',
    format: 'Test',
    isTest: true,
    tournament: 'Anderson-Tendulkar Trophy 2025',
    venue: 'Headingley',
    city: 'Leeds',
    date: '2025-06-20',
    status: 'completed',
    team1: I.ENG,
    team2: I.IND,
    innings1: {
      teamId: 'eng', teamShort: 'ENG', teamColor: '#002D62',
      testScore: '465 & 373/5',
      totalRuns: 373, wickets: 5, overs: '104.4',
    },
    innings2: {
      teamId: 'ind', teamShort: 'IND', teamColor: '#003580',
      testScore: '471 & 364',
      totalRuns: 364, wickets: 10, overs: '122.5',
    },
    result: 'England won by 5 wickets',
    winner: 'ENG',
    manOfMatch: 'Joe Root',
  },
  {
    id: 'test_aus_wi_3',
    matchNumber: '3rd Test',
    format: 'Test',
    isTest: true,
    tournament: 'Australia tour of West Indies 2025',
    venue: 'Sabina Park',
    city: 'Kingston',
    date: '2025-07-12',
    status: 'completed',
    team1: I.AUS,
    team2: I.WI,
    innings1: {
      teamId: 'aus', teamShort: 'AUS', teamColor: '#B5831B',
      testScore: '225 & 121',
      totalRuns: 121, wickets: 10, overs: '38.2',
    },
    innings2: {
      teamId: 'wi', teamShort: 'WI', teamColor: '#7B0041',
      testScore: '143 & 27',
      totalRuns: 27, wickets: 10, overs: '13.1',
    },
    result: 'Australia won by 176 runs',
    winner: 'AUS',
    manOfMatch: 'Mitchell Starc',
    highlight: 'WI bowled out for 27 · Starc 6/9',
  },
];

const testPlayers = [
  {
    id: 'root', name: 'Joe Root', team: 'England', teamShort: 'ENG', teamColor: '#002D62',
    role: 'batsman', matches: 165,
    batting: { innings: 302, runs: 14378, average: 50.8, strikeRate: 57.3, hundreds: 35, fifties: 65, highScore: 254 },
    bowling: { innings: 84, wickets: 65, economy: 2.8, average: 47.2, bestBowling: '5/8' },
  },
  {
    id: 'smith_s', name: 'Steve Smith', team: 'Australia', teamShort: 'AUS', teamColor: '#B5831B',
    role: 'batsman', matches: 114,
    batting: { innings: 206, runs: 9540, average: 57.7, strikeRate: 55.8, hundreds: 35, fifties: 40, highScore: 239 },
    bowling: { innings: 38, wickets: 17, economy: 2.6, average: 57.3, bestBowling: '3/18' },
  },
  {
    id: 'brook', name: 'Harry Brook', team: 'England', teamShort: 'ENG', teamColor: '#002D62',
    role: 'batsman', matches: 30,
    batting: { innings: 54, runs: 3128, average: 61.3, strikeRate: 76.8, hundreds: 9, fifties: 11, highScore: 317 },
    bowling: { innings: 5, wickets: 2, economy: 2.4, average: 72.0, bestBowling: '1/12' },
  },
  {
    id: 'williamson', name: 'Kane Williamson', team: 'New Zealand', teamShort: 'NZ', teamColor: '#1B1B1B',
    role: 'batsman', matches: 103,
    batting: { innings: 183, runs: 8857, average: 53.0, strikeRate: 51.7, hundreds: 32, fifties: 40, highScore: 251 },
    bowling: { innings: 38, wickets: 17, economy: 2.7, average: 47.9, bestBowling: '4/44' },
  },
  {
    id: 'jaiswal', name: 'Yashasvi Jaiswal', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'batsman', matches: 26,
    batting: { innings: 47, runs: 2665, average: 58.1, strikeRate: 69.4, hundreds: 8, fifties: 9, highScore: 214 },
    bowling: { innings: 1, wickets: 0, economy: 3.0, average: 0, bestBowling: '-' },
  },
  {
    id: 'bumrah', name: 'Jasprit Bumrah', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'bowler', matches: 44,
    batting: { innings: 44, runs: 182, average: 6.3, strikeRate: 49.2, hundreds: 0, fifties: 0, highScore: 31 },
    bowling: { innings: 82, wickets: 222, economy: 4.1, average: 19.8, bestBowling: '9/94' },
  },
  {
    id: 'rabada', name: 'Kagiso Rabada', team: 'South Africa', teamShort: 'SA', teamColor: '#007749',
    role: 'bowler', matches: 71,
    batting: { innings: 98, runs: 912, average: 13.5, strikeRate: 52.3, hundreds: 0, fifties: 0, highScore: 59 },
    bowling: { innings: 130, wickets: 336, economy: 3.6, average: 21.7, bestBowling: '7/112' },
  },
  {
    id: 'henry', name: 'Matt Henry', team: 'New Zealand', teamShort: 'NZ', teamColor: '#1B1B1B',
    role: 'bowler', matches: 32,
    batting: { innings: 45, runs: 388, average: 11.1, strikeRate: 42.8, hundreds: 0, fifties: 0, highScore: 47 },
    bowling: { innings: 61, wickets: 136, economy: 3.2, average: 27.4, bestBowling: '6/48' },
  },
  {
    id: 'cummins', name: 'Pat Cummins', team: 'Australia', teamShort: 'AUS', teamColor: '#B5831B',
    role: 'bowler', matches: 60,
    batting: { innings: 90, runs: 1372, average: 17.7, strikeRate: 52.1, hundreds: 0, fifties: 4, highScore: 66 },
    bowling: { innings: 116, wickets: 275, economy: 3.2, average: 25.8, bestBowling: '7/23' },
  },
  {
    id: 'stokes', name: 'Ben Stokes', team: 'England', teamShort: 'ENG', teamColor: '#002D62',
    role: 'allrounder', matches: 111,
    batting: { innings: 192, runs: 6573, average: 36.6, strikeRate: 56.4, hundreds: 13, fifties: 31, highScore: 258 },
    bowling: { innings: 165, wickets: 202, economy: 3.4, average: 32.2, bestBowling: '6/22' },
  },
];

const testStandings = [
  { id: 'aus', name: 'Australia',    shortName: 'AUS', color: '#B5831B', rating: 131, matches: 42, won: 26, lost: 11, noResult: 5, points: 131, nrr: 0, form: ['W','W','W','L','W'] },
  { id: 'sa',  name: 'South Africa', shortName: 'SA',  color: '#007749', rating: 119, matches: 30, won: 18, lost: 7,  noResult: 5, points: 119, nrr: 0, form: ['W','W','L','W','W'] },
  { id: 'ind', name: 'India',        shortName: 'IND', color: '#003580', rating: 104, matches: 36, won: 20, lost: 12, noResult: 4, points: 104, nrr: 0, form: ['W','L','W','W','W'] },
  { id: 'eng', name: 'England',      shortName: 'ENG', color: '#002D62', rating: 102, matches: 40, won: 22, lost: 15, noResult: 3, points: 102, nrr: 0, form: ['W','L','W','W','L'] },
  { id: 'nz',  name: 'New Zealand',  shortName: 'NZ',  color: '#1B1B1B', rating: 101, matches: 30, won: 17, lost: 9,  noResult: 4, points: 101, nrr: 0, form: ['W','W','W','L','W'] },
  { id: 'pak', name: 'Pakistan',     shortName: 'PAK', color: '#014421', rating:  89, matches: 28, won: 14, lost: 10, noResult: 4, points:  89, nrr: 0, form: ['L','W','L','W','L'] },
  { id: 'sl',  name: 'Sri Lanka',    shortName: 'SL',  color: '#003478', rating:  86, matches: 30, won: 14, lost: 12, noResult: 4, points:  86, nrr: 0, form: ['W','L','L','W','L'] },
  { id: 'wi',  name: 'West Indies',  shortName: 'WI',  color: '#7B0041', rating:  68, matches: 26, won: 10, lost: 13, noResult: 3, points:  68, nrr: 0, form: ['L','L','L','W','L'] },
  { id: 'ban', name: 'Bangladesh',   shortName: 'BAN', color: '#006A4E', rating:  67, matches: 26, won: 10, lost: 13, noResult: 3, points:  67, nrr: 0, form: ['L','W','L','L','W'] },
  { id: 'afg', name: 'Afghanistan',  shortName: 'AFG', color: '#002868', rating:  25, matches: 14, won:  4, lost:  9, noResult: 1, points:  25, nrr: 0, form: ['L','L','W','L','L'] },
];

// ─── ODI Cricket ──────────────────────────────────────────────────────────────

const odiMatches = [
  {
    id: 'ct25_final',
    matchNumber: 'Final',
    format: 'ODI',
    tournament: 'ICC Champions Trophy 2025',
    venue: 'Dubai International Cricket Stadium',
    city: 'Dubai',
    date: '2025-03-09',
    status: 'completed',
    team1: I.IND,
    team2: I.NZ,
    innings1: {
      teamId: 'nz', teamShort: 'NZ', teamColor: '#1B1B1B',
      totalRuns: 251, wickets: 7, overs: '50.0', extras: 12,
      batting: [
        { playerName: 'Daryl Mitchell',     runs: 63, balls: 101, fours: 7, sixes: 0, strikeRate: 62.4, dismissal: 'c Gill b Kuldeep' },
        { playerName: 'Michael Bracewell',  runs: 53, balls: 40,  fours: 5, sixes: 1, strikeRate: 132.5, dismissal: 'not out' },
        { playerName: 'Rachin Ravindra',    runs: 37, balls: 29,  fours: 4, sixes: 1, strikeRate: 127.6, dismissal: 'c Rohit b Varun' },
        { playerName: 'Kane Williamson',    runs: 31, balls: 52,  fours: 3, sixes: 0, strikeRate: 59.6, dismissal: 'b Bumrah' },
      ],
      bowling: [
        { playerName: 'Kuldeep Yadav',        overs: 10, maidens: 0, runs: 40, wickets: 2, economy: 4.0 },
        { playerName: 'Varun Chakravarthy',   overs: 10, maidens: 0, runs: 45, wickets: 2, economy: 4.5 },
        { playerName: 'Jasprit Bumrah',       overs: 10, maidens: 1, runs: 38, wickets: 2, economy: 3.8 },
        { playerName: 'Hardik Pandya',        overs: 8,  maidens: 0, runs: 42, wickets: 1, economy: 5.25 },
      ],
    },
    innings2: {
      teamId: 'ind', teamShort: 'IND', teamColor: '#003580',
      totalRuns: 254, wickets: 6, overs: '49.0', extras: 9,
      batting: [
        { playerName: 'Rohit Sharma',   runs: 76, balls: 83, fours: 9, sixes: 2, strikeRate: 91.6, dismissal: 'c Conway b Bracewell' },
        { playerName: 'Shreyas Iyer',   runs: 48, balls: 62, fours: 5, sixes: 1, strikeRate: 77.4, dismissal: 'lbw b Santner' },
        { playerName: 'Shubman Gill',   runs: 31, balls: 50, fours: 3, sixes: 0, strikeRate: 62.0, dismissal: 'c Latham b Jamieson' },
        { playerName: 'Axar Patel',     runs: 28, balls: 24, fours: 2, sixes: 1, strikeRate: 116.7, dismissal: 'not out' },
      ],
      bowling: [
        { playerName: 'Michael Bracewell', overs: 10, maidens: 0, runs: 28, wickets: 2, economy: 2.8 },
        { playerName: 'Mitchell Santner',  overs: 10, maidens: 0, runs: 46, wickets: 2, economy: 4.6 },
        { playerName: 'Matt Henry',        overs: 10, maidens: 0, runs: 52, wickets: 1, economy: 5.2 },
        { playerName: 'Kyle Jamieson',     overs: 7,  maidens: 0, runs: 48, wickets: 1, economy: 6.86 },
      ],
    },
    result: 'India won by 4 wickets',
    winner: 'IND',
    manOfMatch: 'Rohit Sharma',
    note: "India's third Champions Trophy title (2002, 2013, 2025)",
  },
  {
    id: 'ct25_sf1',
    matchNumber: 'Semi-Final 1',
    format: 'ODI',
    tournament: 'ICC Champions Trophy 2025',
    venue: 'National Stadium',
    city: 'Karachi',
    date: '2025-03-04',
    status: 'completed',
    team1: I.NZ,
    team2: I.SA,
    innings1: {
      teamId: 'nz', teamShort: 'NZ', teamColor: '#1B1B1B',
      totalRuns: 273, wickets: 7, overs: '50.0', extras: 15,
      batting: [
        { playerName: 'Rachin Ravindra', runs: 88, balls: 94, fours: 10, sixes: 1, strikeRate: 93.6, dismissal: 'c de Kock b Ngidi' },
        { playerName: 'Daryl Mitchell',  runs: 64, balls: 74, fours: 7,  sixes: 1, strikeRate: 86.5, dismissal: 'b Rabada' },
      ],
      bowling: [
        { playerName: 'Kagiso Rabada',  overs: 10, maidens: 0, runs: 48, wickets: 3, economy: 4.8 },
        { playerName: 'Lungi Ngidi',    overs: 9,  maidens: 0, runs: 52, wickets: 2, economy: 5.8 },
      ],
    },
    innings2: {
      teamId: 'sa', teamShort: 'SA', teamColor: '#007749',
      totalRuns: 241, wickets: 10, overs: '46.4', extras: 10,
      batting: [
        { playerName: 'Rassie van der Dussen', runs: 72, balls: 82, fours: 8, sixes: 0, strikeRate: 87.8, dismissal: 'c Latham b Boult' },
        { playerName: 'Temba Bavuma',          runs: 44, balls: 62, fours: 4, sixes: 0, strikeRate: 71.0, dismissal: 'b Santner' },
      ],
      bowling: [
        { playerName: 'Trent Boult',     overs: 9.4, maidens: 1, runs: 38, wickets: 4, economy: 3.93 },
        { playerName: 'Matt Henry',      overs: 8,   maidens: 0, runs: 42, wickets: 2, economy: 5.25 },
        { playerName: 'Mitchell Santner',overs: 10,  maidens: 0, runs: 41, wickets: 2, economy: 4.1  },
      ],
    },
    result: 'New Zealand won by 32 runs',
    winner: 'NZ',
    manOfMatch: 'Rachin Ravindra',
  },
  {
    id: 'ind_nz_odi1_jan26',
    matchNumber: '1st ODI',
    format: 'ODI',
    tournament: 'New Zealand tour of India 2026',
    venue: 'Rajiv Gandhi International Stadium',
    city: 'Hyderabad',
    date: '2026-01-11',
    status: 'completed',
    team1: I.NZ,
    team2: I.IND,
    innings1: {
      teamId: 'nz', teamShort: 'NZ', teamColor: '#1B1B1B',
      totalRuns: 300, wickets: 8, overs: '50.0', extras: 14,
      batting: [
        { playerName: 'Finn Allen',      runs: 72, balls: 58, fours: 9, sixes: 2, strikeRate: 124.1, dismissal: 'c Gill b Bumrah' },
        { playerName: 'Daryl Mitchell',  runs: 88, balls: 99, fours: 9, sixes: 1, strikeRate: 88.9, dismissal: 'run out' },
        { playerName: 'Tom Latham',      runs: 52, balls: 68, fours: 5, sixes: 0, strikeRate: 76.5, dismissal: 'b Hardik' },
      ],
      bowling: [
        { playerName: 'Jasprit Bumrah', overs: 10, maidens: 1, runs: 42, wickets: 2, economy: 4.2 },
        { playerName: 'Hardik Pandya',  overs: 8,  maidens: 0, runs: 48, wickets: 2, economy: 6.0 },
        { playerName: 'Axar Patel',     overs: 10, maidens: 0, runs: 52, wickets: 2, economy: 5.2 },
        { playerName: 'Kuldeep Yadav',  overs: 10, maidens: 0, runs: 58, wickets: 2, economy: 5.8 },
      ],
    },
    innings2: {
      teamId: 'ind', teamShort: 'IND', teamColor: '#003580',
      totalRuns: 306, wickets: 6, overs: '49.0', extras: 12,
      batting: [
        { playerName: 'Shubman Gill',   runs: 112, balls: 118, fours: 11, sixes: 2, strikeRate: 94.9, dismissal: 'c Allen b Henry' },
        { playerName: 'Rohit Sharma',   runs: 67,  balls: 72,  fours: 8,  sixes: 1, strikeRate: 93.1, dismissal: 'c Latham b Boult' },
        { playerName: 'Virat Kohli',    runs: 42,  balls: 55,  fours: 4,  sixes: 0, strikeRate: 76.4, dismissal: 'b Bracewell' },
        { playerName: 'Shreyas Iyer',   runs: 38,  balls: 31,  fours: 4,  sixes: 1, strikeRate: 122.6, dismissal: 'not out' },
      ],
      bowling: [
        { playerName: 'Trent Boult',   overs: 10, maidens: 0, runs: 58, wickets: 2, economy: 5.8 },
        { playerName: 'Matt Henry',    overs: 9,  maidens: 0, runs: 62, wickets: 2, economy: 6.9 },
        { playerName: 'Kyle Jamieson', overs: 8,  maidens: 0, runs: 52, wickets: 1, economy: 6.5 },
      ],
    },
    result: 'India won by 4 wickets',
    winner: 'IND',
    manOfMatch: 'Shubman Gill',
  },
];

const odiPlayers = [
  {
    id: 'kohli_odi', name: 'Virat Kohli', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'batsman', matches: 296,
    batting: { innings: 283, runs: 13906, average: 57.9, strikeRate: 93.5, hundreds: 50, fifties: 72, highScore: 183 },
    bowling: { innings: 15, wickets: 4, economy: 5.4, average: 78.5, bestBowling: '2/27' },
  },
  {
    id: 'rohit_odi', name: 'Rohit Sharma', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'batsman', matches: 264,
    batting: { innings: 248, runs: 10709, average: 49.1, strikeRate: 89.4, hundreds: 30, fifties: 56, highScore: 264 },
    bowling: { innings: 15, wickets: 8, economy: 5.2, average: 55.4, bestBowling: '2/27' },
  },
  {
    id: 'babar_odi', name: 'Babar Azam', team: 'Pakistan', teamShort: 'PAK', teamColor: '#014421',
    role: 'batsman', matches: 113,
    batting: { innings: 111, runs: 5397, average: 55.9, strikeRate: 88.3, hundreds: 20, fifties: 29, highScore: 158 },
    bowling: { innings: 5, wickets: 0, economy: 5.8, average: 0, bestBowling: '-' },
  },
  {
    id: 'gill_odi', name: 'Shubman Gill', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'batsman', matches: 68,
    batting: { innings: 65, runs: 3228, average: 56.6, strikeRate: 99.3, hundreds: 10, fifties: 16, highScore: 208 },
    bowling: { innings: 3, wickets: 1, economy: 5.7, average: 48.0, bestBowling: '1/36' },
  },
  {
    id: 'rachin', name: 'Rachin Ravindra', team: 'New Zealand', teamShort: 'NZ', teamColor: '#1B1B1B',
    role: 'allrounder', matches: 42,
    batting: { innings: 40, runs: 1856, average: 50.2, strikeRate: 91.7, hundreds: 4, fifties: 12, highScore: 123 },
    bowling: { innings: 30, wickets: 28, economy: 5.1, average: 31.4, bestBowling: '3/34' },
  },
  {
    id: 'bumrah_odi', name: 'Jasprit Bumrah', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'bowler', matches: 86,
    batting: { innings: 22, runs: 33, average: 2.8, strikeRate: 42.3, hundreds: 0, fifties: 0, highScore: 10 },
    bowling: { innings: 85, wickets: 176, economy: 4.6, average: 22.0, bestBowling: '6/19' },
  },
  {
    id: 'starc_odi', name: 'Mitchell Starc', team: 'Australia', teamShort: 'AUS', teamColor: '#B5831B',
    role: 'bowler', matches: 118,
    batting: { innings: 54, runs: 498, average: 13.8, strikeRate: 84.3, hundreds: 0, fifties: 0, highScore: 52 },
    bowling: { innings: 116, wickets: 235, economy: 5.7, average: 22.1, bestBowling: '6/28' },
  },
  {
    id: 'kuldeep', name: 'Kuldeep Yadav', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'bowler', matches: 96,
    batting: { innings: 38, runs: 182, average: 7.9, strikeRate: 71.1, hundreds: 0, fifties: 0, highScore: 22 },
    bowling: { innings: 95, wickets: 185, economy: 5.0, average: 22.3, bestBowling: '6/25' },
  },
  {
    id: 'rabada_odi', name: 'Kagiso Rabada', team: 'South Africa', teamShort: 'SA', teamColor: '#007749',
    role: 'bowler', matches: 104,
    batting: { innings: 46, runs: 386, average: 11.0, strikeRate: 75.2, hundreds: 0, fifties: 0, highScore: 31 },
    bowling: { innings: 103, wickets: 180, economy: 5.2, average: 25.3, bestBowling: '6/16' },
  },
  {
    id: 'boult_odi', name: 'Trent Boult', team: 'New Zealand', teamShort: 'NZ', teamColor: '#1B1B1B',
    role: 'bowler', matches: 112,
    batting: { innings: 48, runs: 288, average: 9.6, strikeRate: 70.9, hundreds: 0, fifties: 0, highScore: 24 },
    bowling: { innings: 111, wickets: 242, economy: 5.3, average: 23.1, bestBowling: '7/34' },
  },
];

const odiStandings = [
  { id: 'ind', name: 'India',        shortName: 'IND', color: '#003580', rating: 118, matches: 27, won: 19, lost: 7,  noResult: 1, points: 118, nrr: 0, form: ['W','W','W','W','W'] },
  { id: 'nz',  name: 'New Zealand',  shortName: 'NZ',  color: '#1B1B1B', rating: 113, matches: 30, won: 20, lost: 9,  noResult: 1, points: 113, nrr: 0, form: ['L','W','W','W','L'] },
  { id: 'aus', name: 'Australia',    shortName: 'AUS', color: '#B5831B', rating: 109, matches: 23, won: 15, lost: 8,  noResult: 0, points: 109, nrr: 0, form: ['W','W','L','W','W'] },
  { id: 'sa',  name: 'South Africa', shortName: 'SA',  color: '#007749', rating: 102, matches: 28, won: 17, lost: 10, noResult: 1, points: 102, nrr: 0, form: ['L','W','W','L','W'] },
  { id: 'pak', name: 'Pakistan',     shortName: 'PAK', color: '#014421', rating:  98, matches: 29, won: 17, lost: 11, noResult: 1, points:  98, nrr: 0, form: ['W','L','L','W','W'] },
  { id: 'sl',  name: 'Sri Lanka',    shortName: 'SL',  color: '#003478', rating:  96, matches: 35, won: 21, lost: 13, noResult: 1, points:  96, nrr: 0, form: ['W','L','W','L','W'] },
  { id: 'afg', name: 'Afghanistan',  shortName: 'AFG', color: '#002868', rating:  93, matches: 21, won: 13, lost: 8,  noResult: 0, points:  93, nrr: 0, form: ['W','W','L','W','L'] },
  { id: 'eng', name: 'England',      shortName: 'ENG', color: '#002D62', rating:  89, matches: 28, won: 15, lost: 12, noResult: 1, points:  89, nrr: 0, form: ['L','L','W','W','L'] },
  { id: 'ban', name: 'Bangladesh',   shortName: 'BAN', color: '#006A4E', rating:  84, matches: 33, won: 17, lost: 15, noResult: 1, points:  84, nrr: 0, form: ['W','L','L','W','L'] },
  { id: 'wi',  name: 'West Indies',  shortName: 'WI',  color: '#7B0041', rating:  74, matches: 28, won: 13, lost: 14, noResult: 1, points:  74, nrr: 0, form: ['L','W','L','L','W'] },
];

// ─── T20I Cricket ─────────────────────────────────────────────────────────────

const t20iMatches = [
  {
    id: 't20i_ind_wi_2',
    matchNumber: '2nd T20I',
    format: 'T20I',
    tournament: 'West Indies tour of India 2026',
    venue: 'M. Chinnaswamy Stadium',
    city: 'Bengaluru',
    date: '2026-06-09',
    status: 'completed',
    team1: I.WI,
    team2: I.IND,
    innings1: {
      teamId: 'wi', teamShort: 'WI', teamColor: '#7B0041',
      totalRuns: 167, wickets: 8, overs: '20.0', extras: 12,
      batting: [
        { playerName: 'Evin Lewis',      runs: 52, balls: 34, fours: 5, sixes: 3, strikeRate: 152.9, dismissal: 'c Kishan b Arshdeep' },
        { playerName: 'Kyle Mayers',     runs: 38, balls: 29, fours: 4, sixes: 1, strikeRate: 131.0, dismissal: 'b Bumrah' },
        { playerName: 'Nicholas Pooran', runs: 34, balls: 22, fours: 2, sixes: 2, strikeRate: 154.5, dismissal: 'c SKY b Hardik' },
        { playerName: 'Andre Fletcher',  runs: 20, balls: 14, fours: 2, sixes: 1, strikeRate: 142.9, dismissal: 'b Arshdeep' },
        { playerName: 'Rovman Powell',   runs: 12, balls: 9,  fours: 1, sixes: 0, strikeRate: 133.3, dismissal: 'run out' },
      ],
      bowling: [
        { playerName: 'Jasprit Bumrah',     overs: 4, maidens: 0, runs: 24, wickets: 3, economy: 6.0  },
        { playerName: 'Arshdeep Singh',     overs: 4, maidens: 0, runs: 38, wickets: 2, economy: 9.5  },
        { playerName: 'Hardik Pandya',      overs: 3, maidens: 0, runs: 34, wickets: 2, economy: 11.3 },
        { playerName: 'Axar Patel',         overs: 4, maidens: 0, runs: 42, wickets: 1, economy: 10.5 },
        { playerName: 'Varun Chakravarthy', overs: 4, maidens: 0, runs: 25, wickets: 0, economy: 6.25 },
      ],
    },
    innings2: {
      teamId: 'ind', teamShort: 'IND', teamColor: '#003580',
      totalRuns: 170, wickets: 6, overs: '19.4', extras: 8,
      batting: [
        { playerName: 'Ishan Kishan',     runs: 56, balls: 38, fours: 6, sixes: 2, strikeRate: 147.4, dismissal: 'not out' },
        { playerName: 'Suryakumar Yadav', runs: 48, balls: 30, fours: 4, sixes: 3, strikeRate: 160.0, dismissal: 'c Pooran b Joseph' },
        { playerName: 'Abhishek Sharma',  runs: 32, balls: 18, fours: 3, sixes: 2, strikeRate: 177.8, dismissal: 'b Hosein' },
      ],
      bowling: [
        { playerName: 'Alzarri Joseph',  overs: 4,   maidens: 0, runs: 38, wickets: 3, economy: 9.5  },
        { playerName: 'Akeal Hosein',    overs: 4,   maidens: 0, runs: 34, wickets: 2, economy: 8.5  },
        { playerName: 'Rovman Powell',   overs: 3,   maidens: 0, runs: 32, wickets: 1, economy: 10.7 },
        { playerName: 'Gudakesh Motie',  overs: 3.4, maidens: 0, runs: 36, wickets: 0, economy: 9.8  },
      ],
    },
    result: 'India won by 4 wickets',
    winner: 'IND',
    manOfMatch: 'Ishan Kishan',
    note: 'India win series 2–0. Kishan 56* off 38 guides close chase.',
  },
  {
    id: 't20wc26_final',
    matchNumber: 'Final',
    format: 'T20I',
    tournament: 'ICC T20 World Cup 2026',
    venue: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    date: '2026-03-08',
    status: 'completed',
    team1: I.IND,
    team2: I.NZ,
    innings1: {
      teamId: 'ind', teamShort: 'IND', teamColor: '#003580',
      totalRuns: 255, wickets: 5, overs: '20.0', extras: 11,
      batting: [
        { playerName: 'Sanju Samson',      runs: 89, balls: 46, fours: 8, sixes: 5, strikeRate: 193.5, dismissal: 'c Conway b Southee' },
        { playerName: 'Ishan Kishan',      runs: 54, balls: 25, fours: 5, sixes: 4, strikeRate: 216.0, dismissal: 'b Southee' },
        { playerName: 'Abhishek Sharma',   runs: 52, balls: 21, fours: 4, sixes: 4, strikeRate: 247.6, dismissal: 'c Williamson b Henry' },
        { playerName: 'Shivam Dube',       runs: 26, balls: 8,  fours: 1, sixes: 3, strikeRate: 325.0, dismissal: 'not out' },
        { playerName: 'Suryakumar Yadav',  runs: 22, balls: 14, fours: 2, sixes: 1, strikeRate: 157.1, dismissal: 'b Boult' },
      ],
      bowling: [
        { playerName: 'Tim Southee',       overs: 4, maidens: 0, runs: 54, wickets: 2, economy: 13.5 },
        { playerName: 'Matt Henry',        overs: 4, maidens: 0, runs: 52, wickets: 1, economy: 13.0 },
        { playerName: 'Trent Boult',       overs: 4, maidens: 0, runs: 48, wickets: 1, economy: 12.0 },
        { playerName: 'Michael Bracewell', overs: 4, maidens: 0, runs: 58, wickets: 1, economy: 14.5 },
      ],
    },
    innings2: {
      teamId: 'nz', teamShort: 'NZ', teamColor: '#1B1B1B',
      totalRuns: 159, wickets: 10, overs: '18.4', extras: 8,
      batting: [
        { playerName: 'Finn Allen',     runs: 44, balls: 28, fours: 5, sixes: 2, strikeRate: 157.1, dismissal: 'c Samson b Bumrah' },
        { playerName: 'Devon Conway',   runs: 38, balls: 31, fours: 4, sixes: 1, strikeRate: 122.6, dismissal: 'b Arshdeep' },
        { playerName: 'Daryl Mitchell', runs: 24, balls: 22, fours: 2, sixes: 1, strikeRate: 109.1, dismissal: 'b Bumrah' },
      ],
      bowling: [
        { playerName: 'Jasprit Bumrah', overs: 4, maidens: 1, runs: 15, wickets: 4, economy: 3.75 },
        { playerName: 'Arshdeep Singh', overs: 4, maidens: 0, runs: 32, wickets: 3, economy: 8.0  },
        { playerName: 'Hardik Pandya',  overs: 3, maidens: 0, runs: 28, wickets: 2, economy: 9.33 },
        { playerName: 'Axar Patel',     overs: 4, maidens: 0, runs: 44, wickets: 1, economy: 11.0 },
      ],
    },
    result: 'India won by 96 runs',
    winner: 'IND',
    manOfMatch: 'Jasprit Bumrah',
    note: 'India are 3× T20 WC champions. Sanju Samson Player of Tournament.',
  },
  {
    id: 'ind_nz_t20_5th_jan26',
    matchNumber: '5th T20I',
    format: 'T20I',
    tournament: 'New Zealand tour of India 2026',
    venue: 'Greenfield International Stadium',
    city: 'Thiruvananthapuram',
    date: '2026-01-31',
    status: 'completed',
    team1: I.IND,
    team2: I.NZ,
    innings1: {
      teamId: 'ind', teamShort: 'IND', teamColor: '#003580',
      totalRuns: 271, wickets: 5, overs: '20.0', extras: 14,
      batting: [
        { playerName: 'Ishan Kishan',     runs: 103, balls: 51, fours: 9, sixes: 7, strikeRate: 201.9, dismissal: 'not out' },
        { playerName: 'Abhishek Sharma',  runs: 74,  balls: 38, fours: 7, sixes: 4, strikeRate: 194.7, dismissal: 'b Southee' },
        { playerName: 'Suryakumar Yadav', runs: 48,  balls: 26, fours: 3, sixes: 3, strikeRate: 184.6, dismissal: 'c Allen b Henry' },
      ],
      bowling: [
        { playerName: 'Tim Southee',  overs: 4, maidens: 0, runs: 58, wickets: 2, economy: 14.5 },
        { playerName: 'Matt Henry',   overs: 4, maidens: 0, runs: 54, wickets: 1, economy: 13.5 },
        { playerName: 'Trent Boult',  overs: 4, maidens: 0, runs: 62, wickets: 1, economy: 15.5 },
        { playerName: 'Ish Sodhi',    overs: 4, maidens: 0, runs: 58, wickets: 1, economy: 14.5 },
      ],
    },
    innings2: {
      teamId: 'nz', teamShort: 'NZ', teamColor: '#1B1B1B',
      totalRuns: 225, wickets: 10, overs: '19.4', extras: 9,
      batting: [
        { playerName: 'Finn Allen',     runs: 68, balls: 36, fours: 7, sixes: 4, strikeRate: 188.9, dismissal: 'b Arshdeep' },
        { playerName: 'Devon Conway',   runs: 54, balls: 38, fours: 5, sixes: 2, strikeRate: 142.1, dismissal: 'c Kishan b Varun' },
        { playerName: 'Daryl Mitchell', runs: 44, balls: 28, fours: 4, sixes: 2, strikeRate: 157.1, dismissal: 'b Arshdeep' },
      ],
      bowling: [
        { playerName: 'Arshdeep Singh',     overs: 4,   maidens: 0, runs: 51, wickets: 5, economy: 12.75 },
        { playerName: 'Jasprit Bumrah',     overs: 4,   maidens: 0, runs: 34, wickets: 3, economy: 8.5   },
        { playerName: 'Varun Chakravarthy', overs: 4,   maidens: 0, runs: 42, wickets: 1, economy: 10.5  },
        { playerName: 'Hardik Pandya',      overs: 3.4, maidens: 0, runs: 44, wickets: 1, economy: 12.0  },
      ],
    },
    result: 'India won by 46 runs',
    winner: 'IND',
    manOfMatch: 'Ishan Kishan',
    note: 'India win series 4–1. Kishan 103 off 51 balls.',
  },
  {
    id: 'ind_nz_t20_1st_jan26',
    matchNumber: '1st T20I',
    format: 'T20I',
    tournament: 'New Zealand tour of India 2026',
    venue: 'Vidarbha Cricket Association Stadium',
    city: 'Nagpur',
    date: '2026-01-21',
    status: 'completed',
    team1: I.IND,
    team2: I.NZ,
    innings1: {
      teamId: 'ind', teamShort: 'IND', teamColor: '#003580',
      totalRuns: 238, wickets: 7, overs: '20.0', extras: 12,
      batting: [
        { playerName: 'Abhishek Sharma',  runs: 84, balls: 35, fours: 8, sixes: 6, strikeRate: 240.0, dismissal: 'c Henry b Southee' },
        { playerName: 'Suryakumar Yadav', runs: 82, balls: 44, fours: 6, sixes: 5, strikeRate: 186.4, dismissal: 'not out' },
        { playerName: 'Ishan Kishan',     runs: 36, balls: 22, fours: 3, sixes: 2, strikeRate: 163.6, dismissal: 'b Boult' },
      ],
      bowling: [
        { playerName: 'Tim Southee',      overs: 4, maidens: 0, runs: 44, wickets: 2, economy: 11.0 },
        { playerName: 'Trent Boult',      overs: 4, maidens: 0, runs: 52, wickets: 2, economy: 13.0 },
        { playerName: 'Matt Henry',       overs: 4, maidens: 0, runs: 48, wickets: 1, economy: 12.0 },
        { playerName: 'Mitchell Santner', overs: 4, maidens: 0, runs: 56, wickets: 1, economy: 14.0 },
      ],
    },
    innings2: {
      teamId: 'nz', teamShort: 'NZ', teamColor: '#1B1B1B',
      totalRuns: 190, wickets: 7, overs: '20.0', extras: 8,
      batting: [
        { playerName: 'Finn Allen',     runs: 58, balls: 32, fours: 6, sixes: 3, strikeRate: 181.3, dismissal: 'b Bumrah' },
        { playerName: 'Devon Conway',   runs: 44, balls: 34, fours: 4, sixes: 1, strikeRate: 129.4, dismissal: 'b Arshdeep' },
        { playerName: 'Glenn Phillips', runs: 38, balls: 24, fours: 3, sixes: 2, strikeRate: 158.3, dismissal: 'not out' },
      ],
      bowling: [
        { playerName: 'Jasprit Bumrah', overs: 4, maidens: 0, runs: 28, wickets: 3, economy: 7.0  },
        { playerName: 'Arshdeep Singh', overs: 4, maidens: 0, runs: 38, wickets: 2, economy: 9.5  },
        { playerName: 'Axar Patel',     overs: 4, maidens: 0, runs: 42, wickets: 1, economy: 10.5 },
        { playerName: 'Hardik Pandya',  overs: 4, maidens: 0, runs: 44, wickets: 1, economy: 11.0 },
      ],
    },
    result: 'India won by 48 runs',
    winner: 'IND',
    manOfMatch: 'Abhishek Sharma',
    note: 'Abhishek 84/35 & SKY 82* power India to 238.',
  },
];

const t20iPlayers = [
  {
    id: 'sky_t20i', name: 'Suryakumar Yadav', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'batsman', matches: 84,
    batting: { innings: 80, runs: 3524, average: 47.6, strikeRate: 173.2, hundreds: 5, fifties: 23, highScore: 117 },
    bowling: { innings: 2, wickets: 0, economy: 8.5, average: 0, bestBowling: '-' },
  },
  {
    id: 'abhishek', name: 'Abhishek Sharma', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'allrounder', matches: 52,
    batting: { innings: 50, runs: 1988, average: 42.3, strikeRate: 186.4, hundreds: 3, fifties: 11, highScore: 135 },
    bowling: { innings: 26, wickets: 16, economy: 8.9, average: 28.6, bestBowling: '2/18' },
  },
  {
    id: 'kishan', name: 'Ishan Kishan', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'wicketkeeper', matches: 38,
    batting: { innings: 36, runs: 1284, average: 38.9, strikeRate: 148.4, hundreds: 2, fifties: 7, highScore: 103 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'tilak', name: 'Tilak Varma', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'batsman', matches: 38,
    batting: { innings: 36, runs: 1288, average: 49.5, strikeRate: 159.4, hundreds: 1, fifties: 10, highScore: 89 },
    bowling: { innings: 2, wickets: 0, economy: 9.0, average: 0, bestBowling: '-' },
  },
  {
    id: 'klaasen', name: 'Heinrich Klaasen', team: 'South Africa', teamShort: 'SA', teamColor: '#007749',
    role: 'wicketkeeper', matches: 76,
    batting: { innings: 66, runs: 2084, average: 43.4, strikeRate: 167.8, hundreds: 2, fifties: 13, highScore: 97 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'head_t20i', name: 'Travis Head', team: 'Australia', teamShort: 'AUS', teamColor: '#B5831B',
    role: 'batsman', matches: 58,
    batting: { innings: 55, runs: 1876, average: 37.5, strikeRate: 165.3, hundreds: 2, fifties: 11, highScore: 110 },
    bowling: { innings: 8, wickets: 6, economy: 8.4, average: 29.2, bestBowling: '2/12' },
  },
  {
    id: 'salt', name: 'Phil Salt', team: 'England', teamShort: 'ENG', teamColor: '#002D62',
    role: 'wicketkeeper', matches: 44,
    batting: { innings: 42, runs: 1428, average: 36.6, strikeRate: 162.8, hundreds: 1, fifties: 9, highScore: 119 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'farhan', name: 'Sahibzada Farhan', team: 'Pakistan', teamShort: 'PAK', teamColor: '#014421',
    role: 'batsman', matches: 32,
    batting: { innings: 30, runs: 1024, average: 36.6, strikeRate: 158.9, hundreds: 1, fifties: 6, highScore: 107 },
    bowling: { innings: 0, wickets: 0, economy: 0, average: 0, bestBowling: '-' },
  },
  {
    id: 'bumrah_t20i', name: 'Jasprit Bumrah', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'bowler', matches: 74,
    batting: { innings: 16, runs: 28, average: 2.8, strikeRate: 52.8, hundreds: 0, fifties: 0, highScore: 10 },
    bowling: { innings: 74, wickets: 112, economy: 6.2, average: 17.1, bestBowling: '4/14' },
  },
  {
    id: 'arshdeep', name: 'Arshdeep Singh', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'bowler', matches: 82,
    batting: { innings: 16, runs: 52, average: 4.3, strikeRate: 65.0, hundreds: 0, fifties: 0, highScore: 11 },
    bowling: { innings: 82, wickets: 126, economy: 8.2, average: 18.6, bestBowling: '5/51' },
  },
  {
    id: 'rashid_t20i', name: 'Rashid Khan', team: 'Afghanistan', teamShort: 'AFG', teamColor: '#002868',
    role: 'bowler', matches: 108,
    batting: { innings: 66, runs: 912, average: 16.6, strikeRate: 119.8, hundreds: 0, fifties: 1, highScore: 48 },
    bowling: { innings: 108, wickets: 172, economy: 6.2, average: 12.0, bestBowling: '5/3' },
  },
  {
    id: 'varun', name: 'Varun Chakravarthy', team: 'India', teamShort: 'IND', teamColor: '#003580',
    role: 'bowler', matches: 28,
    batting: { innings: 4, runs: 8, average: 2.0, strikeRate: 53.3, hundreds: 0, fifties: 0, highScore: 5 },
    bowling: { innings: 28, wickets: 42, economy: 7.4, average: 18.2, bestBowling: '4/13' },
  },
  {
    id: 'adil_rashid', name: 'Adil Rashid', team: 'England', teamShort: 'ENG', teamColor: '#002D62',
    role: 'bowler', matches: 82,
    batting: { innings: 24, runs: 156, average: 8.7, strikeRate: 92.3, hundreds: 0, fifties: 0, highScore: 29 },
    bowling: { innings: 81, wickets: 108, economy: 7.2, average: 21.4, bestBowling: '4/2' },
  },
  {
    id: 'hasaranga', name: 'Wanindu Hasaranga', team: 'Sri Lanka', teamShort: 'SL', teamColor: '#003478',
    role: 'allrounder', matches: 92,
    batting: { innings: 68, runs: 812, average: 18.4, strikeRate: 129.6, hundreds: 0, fifties: 2, highScore: 71 },
    bowling: { innings: 91, wickets: 138, economy: 6.5, average: 13.2, bestBowling: '6/5' },
  },
];

const t20iStandings = [
  { id: 'ind', name: 'India',        shortName: 'IND', color: '#003580', rating: 273, matches: 48, won: 34, lost: 13, noResult: 1, points: 273, nrr: 0, form: ['W','W','W','W','W'] },
  { id: 'eng', name: 'England',      shortName: 'ENG', color: '#002D62', rating: 259, matches: 52, won: 34, lost: 16, noResult: 2, points: 259, nrr: 0, form: ['W','L','W','W','L'] },
  { id: 'aus', name: 'Australia',    shortName: 'AUS', color: '#B5831B', rating: 258, matches: 48, won: 32, lost: 15, noResult: 1, points: 258, nrr: 0, form: ['W','W','L','W','W'] },
  { id: 'nz',  name: 'New Zealand',  shortName: 'NZ',  color: '#1B1B1B', rating: 250, matches: 44, won: 27, lost: 15, noResult: 2, points: 250, nrr: 0, form: ['L','W','L','W','L'] },
  { id: 'sa',  name: 'South Africa', shortName: 'SA',  color: '#007749', rating: 244, matches: 44, won: 28, lost: 15, noResult: 1, points: 244, nrr: 0, form: ['W','W','L','W','L'] },
  { id: 'pak', name: 'Pakistan',     shortName: 'PAK', color: '#014421', rating: 238, matches: 46, won: 27, lost: 18, noResult: 1, points: 238, nrr: 0, form: ['W','L','W','L','W'] },
  { id: 'wi',  name: 'West Indies',  shortName: 'WI',  color: '#7B0041', rating: 235, matches: 42, won: 24, lost: 16, noResult: 2, points: 235, nrr: 0, form: ['W','L','L','W','L'] },
  { id: 'sl',  name: 'Sri Lanka',    shortName: 'SL',  color: '#003478', rating: 227, matches: 46, won: 25, lost: 19, noResult: 2, points: 227, nrr: 0, form: ['L','W','L','W','W'] },
  { id: 'ban', name: 'Bangladesh',   shortName: 'BAN', color: '#006A4E', rating: 223, matches: 40, won: 22, lost: 17, noResult: 1, points: 223, nrr: 0, form: ['W','L','L','W','L'] },
  { id: 'afg', name: 'Afghanistan',  shortName: 'AFG', color: '#002868', rating: 221, matches: 40, won: 23, lost: 16, noResult: 1, points: 221, nrr: 0, form: ['W','L','W','L','W'] },
];

// ─── Main export ──────────────────────────────────────────────────────────────

export const cricketData = {
  ipl: {
    label: 'IPL 2026',
    subtitle: 'Season Complete · RCB Back-to-Back Champions',
    formatType: 'franchise',
    teamsLabel: 'IPL 2026 Final Standings',
    matches: iplMatches,
    players: iplPlayers,
    standings: iplStandings,
  },
  test: {
    label: 'ICC Test',
    subtitle: 'Rankings · May 2026',
    formatType: 'international',
    teamsLabel: 'ICC Test Team Rankings',
    matches: testMatches,
    players: testPlayers,
    standings: testStandings,
  },
  odi: {
    label: 'ICC ODI',
    subtitle: 'Champions Trophy 2025 · India Champions',
    formatType: 'international',
    teamsLabel: 'ICC ODI Team Rankings',
    matches: odiMatches,
    players: odiPlayers,
    standings: odiStandings,
  },
  t20i: {
    label: 'ICC T20I',
    subtitle: 'T20 WC 2026 · India 3× Champions',
    formatType: 'international',
    teamsLabel: 'ICC T20I Team Rankings',
    matches: t20iMatches,
    players: t20iPlayers,
    standings: t20iStandings,
  },
};

// Legacy exports for backward-compat (not needed in updated screen)
export const TEAMS = T;
export const recentMatches = iplMatches;
export const topPlayers = iplPlayers;
export const standings = iplStandings;

// ── Extra player stats (ducks, 4W, 5W) ───────────────────────────────────────
const PLAYER_EXTRA_STATS = {
  // IPL 2026 batters
  sooryavanshi:    { ducks: 1 },
  gill_ipl26:      { ducks: 0 },
  sudharsan_ipl26: { ducks: 0 },
  kohli_ipl26:     { ducks: 0 },
  klaasen_ipl26:   { ducks: 1 },
  // IPL 2026 bowlers — T20 format, fiveWickets is extremely rare
  rabada_ipl26:    { fiveWickets: 0, fourWickets: 3 },
  bhuvi_ipl26:     { fiveWickets: 0, fourWickets: 4 },
  archer_ipl26:    { fiveWickets: 0, fourWickets: 2 },
  rashid_ipl26:    { fiveWickets: 0, fourWickets: 4 },
  kamboj_ipl26:    { fiveWickets: 0, fourWickets: 2 },
  // Test batters
  root:            { ducks: 5 },
  smith_s:         { ducks: 6 },
  brook:           { ducks: 3 },
  williamson:      { ducks: 4 },
  jaiswal:         { ducks: 3 },
  stokes:          { ducks: 5, fiveWickets: 5, fourWickets: 12 },
  // Test bowlers
  bumrah:          { fiveWickets:  6, fourWickets: 14 },
  rabada:          { fiveWickets: 14, fourWickets: 22 },
  henry:           { fiveWickets:  6, fourWickets:  8 },
  cummins:         { fiveWickets: 12, fourWickets: 19 },
  // ODI batters
  kohli_odi:       { ducks: 12 },
  rohit_odi:       { ducks: 14 },
  babar_odi:       { ducks:  5 },
  gill_odi:        { ducks:  3 },
  // ODI bowlers
  kuldeep:         { fiveWickets: 2, fourWickets:  4 },
  rabada_odi:      { fiveWickets: 3, fourWickets:  8 },
  boult_odi:       { fiveWickets: 3, fourWickets:  9 },
  // T20I batters
  sky_t20i:        { ducks: 3 },
  abhishek:        { ducks: 2 },
  kishan:          { ducks: 2 },
  tilak:           { ducks: 2 },
  klaasen:         { ducks: 4 },
  head_t20i:       { ducks: 3 },
  salt:            { ducks: 5 },
  farhan:          { ducks: 3 },
  // T20I bowlers
  bumrah_t20i:     { fiveWickets: 0, fourWickets: 8 },
  arshdeep:        { fiveWickets: 1, fourWickets: 6 },
  rashid_t20i:     { fiveWickets: 3, fourWickets: 6 },
  varun:           { fiveWickets: 0, fourWickets: 4 },
  adil_rashid:     { fiveWickets: 0, fourWickets: 3 },
  hasaranga:       { fiveWickets: 2, fourWickets: 6 },
};

// ── ESPN Cricinfo player IDs ──────────────────────────────────────────────────
const ESPN_IDS = {
  // IPL 2026
  sooryavanshi:   1429551,
  gill_ipl26:      931581,
  sudharsan_ipl26: 1265818,
  kohli_ipl26:     253802,
  klaasen_ipl26:   413259,
  rabada_ipl26:    427936,
  bhuvi_ipl26:     326016,
  archer_ipl26:    669855,
  rashid_ipl26:    793463,
  // Test
  root:            303669,
  smith_s:         267192,
  brook:           670999,
  williamson:      277906,
  jaiswal:         1262527,
  bumrah:          631540,
  rabada:          427936,
  henry:           566731,
  cummins:         671261,
  stokes:          391481,
  // ODI
  kohli_odi:       253802,
  rohit_odi:        34102,
  babar_odi:       348144,
  gill_odi:        931581,
  kuldeep:         559235,
  rabada_odi:      427936,
  boult_odi:       279173,
  // T20I
  sky_t20i:        480683,
  abhishek:        1151359,
  kishan:          720471,
  tilak:           1311158,
  klaasen:         413259,
  head_t20i:       529812,
  salt:            1311325,
  bumrah_t20i:     631540,
  arshdeep:        1209007,
  rashid_t20i:     793463,
  varun:           943009,
  adil_rashid:     234675,
  hasaranga:       1175516,
};

// Find a match by ID across all formats
export function findMatchById(id) {
  for (const format of Object.values(cricketData)) {
    const m = format.matches.find(match => match.id === id);
    if (m) return m;
  }
  return null;
}

// Find a player by ID across all formats; injects espnId, format metadata, and extra stats
export function findPlayerById(id) {
  for (const [formatKey, format] of Object.entries(cricketData)) {
    const p = format.players.find(player => player.id === id);
    if (p) {
      const extra = PLAYER_EXTRA_STATS[id] ?? {};
      return {
        ...p,
        espnId:      ESPN_IDS[id] ?? null,
        formatKey,
        formatLabel: format.label,
        batting:     { ...p.batting,  ducks:        extra.ducks        ?? 0 },
        bowling:     { ...p.bowling,  fiveWickets:  extra.fiveWickets  ?? 0,
                                      fourWickets:  extra.fourWickets  ?? 0 },
      };
    }
  }
  return null;
}

// Returns true if any format has at least one live match
export function hasAnyLiveMatch() {
  return Object.values(cricketData).some(f => f.matches.some(m => m.status === 'live'));
}
