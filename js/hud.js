// ─────────────────────────────────────────────
//  HUD
// ─────────────────────────────────────────────

function collectIncome() {
  let total = 0;
  PROPERTIES.forEach(p => {
    if (G.properties[p.id]) total += p.income * G.properties[p.id];
  });
  return total;
}

function updateHUD() {
  const rank = RANK_NAMES[Math.min(G.level - 1, RANK_NAMES.length - 1)];
  $('h-level').textContent = rank;
  $('h-money').textContent = '$' + G.money.toLocaleString();
  $('h-rep').textContent = G.rep;
  $('h-energy').textContent = G.energy + '/' + G.maxEnergy;
  $('h-health').textContent = G.health + '/' + G.maxHealth;

  const xpPct = Math.min((G.xp / G.xpNext) * 100, 100);
  $('xp-bar').style.width = xpPct + '%';
  $('xp-label').textContent = G.xp + ' / ' + G.xpNext;

  const ePct = (G.energy / G.maxEnergy) * 100;
  $('energy-bar').style.width = ePct + '%';
  $('energy-label').textContent = G.energy + ' / ' + G.maxEnergy;

  const hPct = (G.health / G.maxHealth) * 100;
  $('health-bar').style.width = hPct + '%';
  $('health-label').textContent = G.health + ' / ' + G.maxHealth;

  $('collect-income').textContent = '$' + collectIncome();
}
