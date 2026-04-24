// ─────────────────────────────────────────────
//  STATIC GAME DATA
//  TODO: migrate to CDN-hosted JSON files
// ─────────────────────────────────────────────

const JOBS = [
  { id:'lookout', name:'Be a Lookout', energy:1, money:[20,40], xp:8, rep:2, levelReq:1, times:10 },
  { id:'runner', name:'Run Packages', energy:2, money:[50,90], xp:15, rep:5, levelReq:1, times:8 },
  { id:'boost', name:'Boost a Whip', energy:3, money:[100,180], xp:25, rep:10, levelReq:2, times:6 },
  { id:'stash', name:'Guard the Stash', energy:2, money:[80,130], xp:20, rep:8, levelReq:2, times:8 },
  { id:'shake', name:'Shake a Block', energy:3, money:[150,250], xp:35, rep:15, levelReq:3, times:5 },
  { id:'hit', name:'Pull a Lick', energy:4, money:[200,400], xp:50, rep:25, levelReq:3, times:4 },
  { id:'move', name:'Move Weight', energy:5, money:[400,700], xp:80, rep:40, levelReq:5, times:3 },
  { id:'takeover', name:'Block Takeover', energy:6, money:[600,1000], xp:120, rep:60, levelReq:7, times:2 },
];

const ENEMIES = [
  { id:'snitch', name:'Local Snitch', icon:'🐀', hp:40, atk:6, def:3, lvlReq:1, reward:{money:[30,60], rep:10, xp:15} },
  { id:'stick', name:'Block Bully', icon:'😤', hp:70, atk:12, def:6, lvlReq:1, reward:{money:[80,150], rep:20, xp:30} },
  { id:'oppcrew', name:'Opp Crew', icon:'🤬', hp:120, atk:20, def:10, lvlReq:3, reward:{money:[200,350], rep:50, xp:60} },
  { id:'jackers', name:'Car Jackers', icon:'🔫', hp:90, atk:18, def:8, lvlReq:2, reward:{money:[150,280], rep:35, xp:45} },
  { id:'rival', name:'Rival Boss', icon:'😈', hp:200, atk:30, def:15, lvlReq:5, reward:{money:[500,800], rep:100, xp:120} },
  { id:'fed', name:'Undercover Fed', icon:'🕵️', hp:160, atk:25, def:20, lvlReq:4, reward:{money:[300,600], rep:80, xp:90} },
];

const STORE_ITEMS = [
  { id:'knife', name:'Switchblade', icon:'🔪', desc:'+5 ATK', price:200, atk:5, def:0 },
  { id:'vest', name:'Bulletproof Vest', icon:'🦺', desc:'+10 DEF', price:500, atk:0, def:10 },
  { id:'glock', name:'Glock 19', icon:'🔫', desc:'+15 ATK', price:1000, atk:15, def:0 },
  { id:'burner', name:'Burner Phone', icon:'📱', desc:'+5 ATK +5 DEF', price:600, atk:5, def:5 },
  { id:'bando', name:'Safe House', icon:'🏚️', desc:'+20 DEF, +10 HP regen', price:2000, atk:0, def:20, hpBonus:10 },
  { id:'ak', name:'Draco', icon:'🪖', desc:'+30 ATK', price:3500, atk:30, def:0 },
];

const PROPERTIES = [
  { id:'corner', name:'Corner Store', icon:'🏪', price:800, income:50, desc:'$50 per collect' },
  { id:'barber', name:'Barber Shop', icon:'💈', price:1500, income:120, desc:'$120 per collect' },
  { id:'laundry', name:'Laundromat', icon:'🧺', price:3000, income:250, desc:'$250 per collect' },
  { id:'carwash', name:'Car Wash', icon:'🚗', price:5000, income:500, desc:'$500 per collect' },
  { id:'club', name:'Nightclub', icon:'🎵', price:10000, income:1200, desc:'$1200 per collect' },
];

const RANK_NAMES = ['Shorty','Soldier','Block Boy','OG','Set Leader','Don','Boss','Kingpin','Legend','Untouchable'];
