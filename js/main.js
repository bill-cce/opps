// ─────────────────────────────────────────────
//  GAME DATA — populated from JSON files
// ─────────────────────────────────────────────

let JOBS = [];
let ENEMIES = [];
let STORE_ITEMS = [];
let PROPERTIES = [];
let RANK_NAMES = [];

// ─────────────────────────────────────────────
//  MAIN — INIT
// ─────────────────────────────────────────────

function addXP(amt) {
  G.xp += amt;
  while (G.xp >= G.xpNext) {
    G.xp -= G.xpNext;
    G.level++;
    G.xpNext = Math.floor(G.xpNext * 1.6);
    G.maxEnergy += 2;
    G.energy = G.maxEnergy;
    G.maxHealth += 15;
    G.health = G.maxHealth;
    G.attack += 3;
    G.defense += 2;
    showLevelUp();
    renderJobs();
    renderEnemies();
  }
  updateHUD();
}

// ─────────────────────────────────────────────
//  ENERGY REGEN — timestamp based
//  Safe when tab is backgrounded or killed
// ─────────────────────────────────────────────

const ENERGY_REGEN_SECONDS = 60; // 1 energy per 60 seconds

function applyOfflineEnergyRegen() {
  const lastSeen = parseInt(localStorage.getItem('opps_lastSeen') || Date.now());
  const now = Date.now();
  const secondsElapsed = Math.floor((now - lastSeen) / 1000);
  const energyToAdd = Math.floor(secondsElapsed / ENERGY_REGEN_SECONDS);
  if (energyToAdd > 0) {
    G.energy = Math.min(G.maxEnergy, G.energy + energyToAdd);
  }
}

function tickEnergyRegen() {
  localStorage.setItem('opps_lastSeen', Date.now());
  if (G.energy < G.maxEnergy) {
    // Check if a full regen interval has passed since last tick
    const lastTick = parseInt(localStorage.getItem('opps_lastEnergyTick') || Date.now());
    const secondsElapsed = Math.floor((Date.now() - lastTick) / 1000);
    if (secondsElapsed >= ENERGY_REGEN_SECONDS) {
      G.energy = Math.min(G.maxEnergy, G.energy + 1);
      localStorage.setItem('opps_lastEnergyTick', Date.now());
      updateHUD();
      GameState.save();
    }
  }
}

// ─────────────────────────────────────────────
//  LOAD JSON DATA FROM CDN
// ─────────────────────────────────────────────

async function loadGameData() {
  try {
    const [jobs, enemies, store, properties, ranks] = await Promise.all([
      fetch('data/jobs.json').then(r => r.json()),
      fetch('data/enemies.json').then(r => r.json()),
      fetch('data/store.json').then(r => r.json()),
      fetch('data/properties.json').then(r => r.json()),
      fetch('data/ranks.json').then(r => r.json())
    ]);

    JOBS        = jobs;
    ENEMIES     = enemies;
    STORE_ITEMS = store;
    PROPERTIES  = properties;
    RANK_NAMES  = ranks;

  } catch (err) {
    console.error('Failed to load game data:', err);
    // TODO: show a user-facing error message
  }
}

// ─────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────

async function init() {
  // Load all JSON data first — everything depends on this
  await loadGameData();

  // Load saved player state if available
  const saved = await GameState.load();
  if (saved) {
    GameState.apply(saved);
    applyOfflineEnergyRegen();
    log('⚡ Welcome back. Your empire awaits.', 'info');
  } else {
    log('⚡ Energy refills every 60 seconds. Stack your bread.', 'info');
  }

  // Render all tabs
  renderJobs();
  renderEnemies();
  renderStore();
  renderProps();
  updateHUD();

  // Start energy regen tick — checks every 10 seconds, only regens on full interval
  setInterval(tickEnergyRegen, 10000);

  // Track last seen for offline regen on next load
  setInterval(() => localStorage.setItem('opps_lastSeen', Date.now()), 5000);
}

init();
