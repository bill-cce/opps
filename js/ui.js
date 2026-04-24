// ─────────────────────────────────────────────
//  UI HELPERS
// ─────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  $('tab-' + name).classList.add('active');
  $('nav-' + name).classList.add('active');
  if (name === 'stats') renderStats();
}

function log(msg, cls = '') {
  const feed = $('feed');
  const line = document.createElement('div');
  line.className = 'feed-line ' + cls;
  const now = new Date();
  line.textContent = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}] ${msg}`;
  feed.insertBefore(line, feed.firstChild);
  while (feed.children.length > 30) feed.removeChild(feed.lastChild);
}

function toast(msg, bad = false) {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show' + (bad ? ' bad' : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.className = 'toast', 2500);
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function showLevelUp() {
  const banner = $('levelup-banner');
  const rank = RANK_NAMES[Math.min(G.level - 1, RANK_NAMES.length - 1)];
  $('levelup-sub').textContent = `You are now "${rank}" (Rank ${G.level})`;
  banner.classList.add('show');
  log(`🔥 RANKED UP to "${rank}" (Rank ${G.level})!`, 'gold');
  setTimeout(() => banner.classList.remove('show'), 3000);
}
