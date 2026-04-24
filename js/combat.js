// ─────────────────────────────────────────────
//  COMBAT
// ─────────────────────────────────────────────

let combatEnemy = null;

function renderEnemies() {
  const container = $('enemy-list');
  container.innerHTML = '';
  ENEMIES.forEach(e => {
    const locked = G.level < e.lvlReq;
    const div = document.createElement('div');
    div.className = 'enemy-card';
    div.innerHTML = `
      <div class="enemy-avatar">${e.icon}</div>
      <div class="enemy-info">
        <div class="enemy-name">${e.name}</div>
        <div class="enemy-stats">
          <span>❤️ <span class="val">${e.hp}</span></span>
          <span>⚔️ <span class="val">${e.atk}</span></span>
          <span>🛡️ <span class="val">${e.def}</span></span>
          <span>💰 <span class="val">$${e.reward.money[0]}-$${e.reward.money[1]}</span></span>
        </div>
      </div>
      ${locked
        ? `<div style="color:var(--muted);font-size:12px;">🔒 Rank ${e.lvlReq}</div>`
        : `<button class="attack-btn" onclick="startCombat('${e.id}')">SLIDE ON 'EM</button>`
      }
    `;
    container.appendChild(div);
  });
}

function startCombat(enemyId) {
  if (G.health < 20) { toast('Too hurt to fight! Rest up first.', true); return; }
  const e = ENEMIES.find(x => x.id === enemyId);
  if (!e) return;
  combatEnemy = { ...e, curHp: e.hp };

  $('c-enemy-icon').textContent = e.icon;
  $('c-enemy-name').textContent = e.name;
  $('c-player-hp').style.width = '100%';
  $('c-enemy-hp').style.width = '100%';
  $('combat-log').innerHTML = '';
  $('combat-result').textContent = '';
  $('close-combat').style.display = 'none';
  $('combat-overlay').classList.add('open');

  runCombat(e);
}

function combatLog(msg, color) {
  const el = document.createElement('div');
  el.style.cssText = `color:${color};padding:2px 0;border-bottom:1px solid #1a1a1a;`;
  el.textContent = msg;
  const log = $('combat-log');
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

function runCombat(enemyData) {
  let playerHp = G.health;
  let enemyHp = enemyData.hp;
  let round = 1;
  const maxPHp = G.health;
  const maxEHp = enemyData.hp;

  const interval = setInterval(() => {
    // Player attacks
    const playerDmg = Math.max(1, rand(G.attack, G.attack + 10) - enemyData.def);
    enemyHp -= playerDmg;
    combatLog(`Round ${round}: You hit ${enemyData.name} for ${playerDmg} dmg`, '#00e676');
    $('c-enemy-hp').style.width = Math.max(0, (enemyHp / maxEHp) * 100) + '%';

    if (enemyHp <= 0) {
      clearInterval(interval);
      const moneyWon = rand(enemyData.reward.money[0], enemyData.reward.money[1]);
      G.money += moneyWon;
      G.rep += enemyData.reward.rep;
      addXP(enemyData.reward.xp);
      G.health = playerHp;
      updateHUD();
      $('combat-result').textContent = '🏆 YOU SMOKED HIM!';
      $('combat-result').style.color = 'var(--green)';
      $('close-combat').style.display = 'inline-block';
      log(`⚔️ Smoked ${enemyData.name} — won $${moneyWon} + ${enemyData.reward.xp} XP`, 'win');
      GameState.save();
      return;
    }

    // Enemy attacks
    const enemyDmg = Math.max(1, rand(enemyData.atk, enemyData.atk + 5) - G.defense);
    playerHp -= enemyDmg;
    combatLog(`Round ${round}: ${enemyData.name} hits you for ${enemyDmg} dmg`, '#ff5252');
    $('c-player-hp').style.width = Math.max(0, (playerHp / maxPHp) * 100) + '%';

    if (playerHp <= 0) {
      clearInterval(interval);
      const moneyLost = Math.floor(G.money * 0.1);
      G.money = Math.max(0, G.money - moneyLost);
      G.health = 5;
      updateHUD();
      $('combat-result').textContent = `💀 YOU CAUGHT AN L! Lost $${moneyLost}`;
      $('combat-result').style.color = 'var(--red)';
      $('close-combat').style.display = 'inline-block';
      log(`💀 Got beat by ${enemyData.name} — lost $${moneyLost}`, 'loss');
      GameState.save();
      return;
    }

    round++;
  }, 600);
}

function closeCombat() {
  $('combat-overlay').classList.remove('open');
}
