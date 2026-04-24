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
};

// ─────────────────────────────────────────────
//  GAMESTATE ABSTRACTION
//  Swap out localStorage calls here when
//  Jest SDK becomes available
// ─────────────────────────────────────────────

const GameState = {
  async save() {
    // TODO: replace with JestSDK.savePlayerData(G)
    try {
      localStorage.setItem('opps_gamestate', JSON.stringify(G));
    } catch(e) {
      console.warn('GameState.save failed:', e);
    }
  },

  async load() {
    // TODO: replace with JestSDK.getPlayerData()
    try {
      const saved = localStorage.getItem('opps_gamestate');
      if (!saved) return null;
      return JSON.parse(saved);
    } catch(e) {
      console.warn('GameState.load failed:', e);
      return null;
    }
  },

  async getHardCurrencyBalance() {
    // TODO: replace with JestSDK.wallet.getBalance()
    return 1000; // mocked
  },

  async debitHardCurrency(amount) {
    // TODO: replace with JestSDK.wallet.debit(amount)
    console.log(`Mock hard currency debit: ${amount} credits`);
    return true;
  },

  apply(saved) {
    // Merge saved data into G, preserving any new keys added since last save
    Object.assign(G, saved);
  }
};
