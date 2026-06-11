const FLAG_CODES = {
  'India': 'in',
  'Australia': 'au',
  'England': 'gb-eng',
  'Pakistan': 'pk',
  'South Africa': 'za',
  'New Zealand': 'nz',
  'Sri Lanka': 'lk',
  'Bangladesh': 'bd',
  'Afghanistan': 'af',
  'Ireland': 'ie',
  'Zimbabwe': 'zw',
  'Scotland': 'gb-sct',
  'Netherlands': 'nl',
  'Nepal': 'np',
  'Namibia': 'na',
  'Jersey': 'je',
  'Thailand': 'th',
  'Uganda': 'ug',
  'Canada': 'ca',
  'USA': 'us',
};

export function getTeamFlagUrl(name) {
  if (!name) return null;
  const code = FLAG_CODES[name];
  if (!code) return null;
  return `https://flagcdn.com/w80/${code}.png`;
}

export const TEAM_COLORS = {
  'India': '#0033A0',
  'Australia': '#FFCD00',
  'England': '#003087',
  'New Zealand': '#000000',
  'South Africa': '#007A4D',
  'Pakistan': '#01411C',
  'West Indies': '#7B0041',
  'Sri Lanka': '#003087',
  'Bangladesh': '#006A4E',
  'Afghanistan': '#000080',
  'Ireland': '#4CAF50',
  'Zimbabwe': '#D40000',
  'Mumbai Indians': '#004BA0',
  'Chennai Super Kings': '#FDB913',
  'Royal Challengers Bengaluru': '#B22222',
  'Royal Challengers Bangalore': '#B22222',
  'Kolkata Knight Riders': '#3A225D',
  'Delhi Capitals': '#17449B',
  'Punjab Kings': '#FFCC00',
  'Rajasthan Royals': '#EA1A85',
  'Sunrisers Hyderabad': '#F7621E',
  'Gujarat Titans': '#1D3461',
  'Lucknow Super Giants': '#A0C8E5',
};

export const INTERNATIONAL_TEAMS = [
  'India', 'Australia', 'England', 'Pakistan', 'South Africa',
  'New Zealand', 'West Indies', 'Sri Lanka', 'Bangladesh', 'Afghanistan',
  'Ireland', 'Zimbabwe',
];

export const IPL_TEAMS = [
  'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bengaluru',
  'Kolkata Knight Riders', 'Delhi Capitals', 'Punjab Kings',
  'Rajasthan Royals', 'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants',
];

export const ALL_TEAMS = [...INTERNATIONAL_TEAMS, ...IPL_TEAMS];

export function getTeamAbbr(name) {
  const map = {
    'India': 'IND', 'Australia': 'AUS', 'England': 'ENG', 'Pakistan': 'PAK',
    'South Africa': 'SA', 'New Zealand': 'NZ', 'West Indies': 'WI',
    'Sri Lanka': 'SL', 'Bangladesh': 'BAN', 'Afghanistan': 'AFG',
    'Ireland': 'IRE', 'Zimbabwe': 'ZIM',
    'Mumbai Indians': 'MI', 'Chennai Super Kings': 'CSK',
    'Royal Challengers Bengaluru': 'RCB', 'Royal Challengers Bangalore': 'RCB',
    'Kolkata Knight Riders': 'KKR', 'Delhi Capitals': 'DC',
    'Punjab Kings': 'PBKS', 'Rajasthan Royals': 'RR',
    'Sunrisers Hyderabad': 'SRH', 'Gujarat Titans': 'GT',
    'Lucknow Super Giants': 'LSG',
  };
  return map[name] || name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3);
}

export function getTeamColor(name) {
  if (!name) return '#4ADE80';
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return color;
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 60%, 45%)`;
}

export function buildTeamList() {
  return ALL_TEAMS.map(name => ({
    name,
    abbr: getTeamAbbr(name),
    color: getTeamColor(name),
    category: INTERNATIONAL_TEAMS.includes(name) ? 'international' : 'ipl',
  }));
}
