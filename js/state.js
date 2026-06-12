// ─────────────────────────────────────────────
//  GAME STATE
// ─────────────────────────────────────────────

const G = {
  level: 1, xp: 0, xpNext: 100,
  money: 500,
  rep: 0,
  energy: 10, maxEnergy: 10,
  health: 100, maxHealth: 100,
  attack: 10, defense: 5,
  inventory: [],
  properties: {},
  jobProgress: {},
  playerId: null,
  lastSeen: 0,
  lastEnergyTick: 0,
  crewMemberCount: 0,
  recruitedBy: null,
  gems: 0,
};

// ─────────────────────────────────────────────
//  GAMESTATE ABSTRACTION
//  Swap out localStorage calls here when
//  Jest SDK becomes available
// ─────────────────────────────────────────────

const GameState = {
  async save() {
    if (typeof JestSDK !== 'undefined') {
      await JestSDK.data.set('g', G);
    } else {
      try { localStorage.setItem('opps_gamestate', JSON.stringify(G)); } catch(e) {
        console.warn('GameState.save failed:', e);
      }
    }
  },

  async load() {
    if (typeof JestSDK !== 'undefined') {
      const data = await JestSDK.data.getAll();
      return data.g ?? null;
    } else {
      try {
        const saved = localStorage.getItem('opps_gamestate');
        return saved ? JSON.parse(saved) : null;
      } catch(e) {
        console.warn('GameState.load failed:', e);
        return null;
      }
    }
  },

  apply(saved) {
    Object.assign(G, saved);
  }
};
