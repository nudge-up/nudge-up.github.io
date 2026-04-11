// ── Cursor ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a,button,input,select').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1.8)'; cursor.style.background = 'var(--lilac)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = 'var(--pink)'; });
});

// ── Marquee ──
const marqueeItems = ['Set goals ✨', 'Earn XP 💫', 'Break records 🔥', 'Crush streaks 💪', 'Treat yourself 💅', 'Be that girl 🌸', 'Glow up season 🦋', 'Main character 🌟', 'Build habits 🎯', 'Stay hydrated 💧'];
const t = document.getElementById('marqueeTrack');
[...marqueeItems, ...marqueeItems].forEach(txt => {
  const el = document.createElement('div'); el.className = 'marquee-item';
  el.innerHTML = txt; t.appendChild(el);
});

// ── Goal state ──
let goals = [], selectedEmoji = '💪', selectedCat = 'Health', totalXP = 0;
const xpEl = document.getElementById('totalXP');

function setXP(v) { totalXP = v; xpEl.textContent = v.toLocaleString(); }

document.querySelectorAll('.emoji-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); selectedEmoji = btn.dataset.emoji;
  });
});
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); selectedCat = btn.dataset.cat;
  });
});

const xpSlider = document.getElementById('xpSlider');
const xpDisplay = document.getElementById('xpDisplay');
xpSlider.addEventListener('input', () => xpDisplay.textContent = xpSlider.value + ' XP');

function addGoal() {
  const inp = document.getElementById('goalInput');
  const title = inp.value.trim();
  if (!title) { inp.focus(); inp.style.borderColor = 'var(--rose)'; setTimeout(() => inp.style.borderColor = '', 800); return; }
  const g = { id: Date.now(), title, emoji: selectedEmoji, cat: selectedCat, xp: +xpSlider.value, done: false };
  goals.push(g); inp.value = ''; renderGoals();
}

function renderGoals() {
  const list = document.getElementById('goalsList');
  const count = document.getElementById('goalCount');
  count.textContent = `(${goals.length} goal${goals.length !== 1 ? 's' : ''})`;
  if (!goals.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-emoji">🌸</div><div>No goals yet, babe.<br>Add your first one! ✨</div></div>`;
    return;
  }
  list.innerHTML = goals.map(g => `
    <div class="goal-item ${g.done ? 'done' : ''}" id="goal-${g.id}">
      <button class="goal-check ${g.done ? 'checked' : ''}" onclick="toggleGoal(${g.id})">${g.done ? '✓' : ''}</button>
      <span class="goal-emoji">${g.emoji}</span>
      <div class="goal-info">
        <div class="goal-title">${g.title}</div>
        <div class="goal-meta">
          <span>${g.cat}</span>
          <span class="goal-xp-badge">+${g.xp} XP</span>
        </div>
      </div>
      <button class="goal-delete" onclick="deleteGoal(${g.id})">🗑️</button>
    </div>
  `).join('');
}

function toggleGoal(id) {
  const g = goals.find(x => x.id === id);
  if (!g || g.done) return;
  g.done = true;
  setXP(totalXP + g.xp);
  renderGoals();
  showConfetti(g.title, g.xp, g.emoji);
}

function deleteGoal(id) {
  goals = goals.filter(x => x.id !== id);
  renderGoals();
}

// ── Confetti ──
function showConfetti(title, xp, emoji) {
  document.getElementById('confettiTitle').textContent = emoji + ' Goal Crushed!';
  document.getElementById('confettiSub').textContent = `"${title}" — you absolute queen 👑`;
  document.getElementById('confettiXP').textContent = `+${xp} XP earned! ✨`;
  document.getElementById('confettiOverlay').classList.add('active');
  launchConfetti();
}

function launchConfetti() {
  const colors = ['#ff6eb4', '#ff3d7f', '#c084fc', '#fef08a', '#6ee7b7', '#ffb085', '#a78bfa'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.cssText = `
        left:${Math.random() * 100}vw;
        top:-20px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        width:${6 + Math.random() * 8}px;
        height:${6 + Math.random() * 8}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration:${2 + Math.random() * 2}s;
        animation-delay:0s;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4000);
    }, i * 30);
  }
}

function closeConfetti() {
  document.getElementById('confettiOverlay').classList.remove('active');
}

// ── Rewards ──
function redeemReward(name, cost) {
  if (totalXP < cost) {
    alert(`You need ${cost - totalXP} more XP! Keep completing goals 💪`);
    return;
  }
  setXP(totalXP - cost);
  document.getElementById('confettiTitle').textContent = '🎁 Reward Redeemed!';
  document.getElementById('confettiSub').textContent = `Enjoy your ${name} — you deserved it! 💕`;
  document.getElementById('confettiXP').textContent = `-${cost} XP spent`;
  document.getElementById('confettiOverlay').classList.add('active');
  launchConfetti();
}

function addCustomReward() {
  const name = prompt('What\'s your custom reward? 🌸');
  if (!name) return;
  const xp = parseInt(prompt('How many XP should it cost?') || '100');
  const el = document.createElement('div');
  el.className = 'reward-card';
  el.innerHTML = `
    <div class="reward-emoji">🎀</div>
    <div class="reward-name">${name}</div>
    <div style="font-size:0.78rem;color:var(--muted);margin-bottom:0.6rem;">Your custom reward</div>
    <div class="reward-cost">⚡ ${xp} XP</div>
    <button class="redeem-btn" onclick="redeemReward('${name}', ${xp})">Redeem ✨</button>
  `;
  document.querySelector('.rewards-grid').insertBefore(el, document.querySelector('.rewards-grid').lastElementChild);
}

// ── Streak week ──
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const emojis = ['🌸', '⭐', '💫', '🔥', '🏃', '🌙', '🎯'];
const filled = [true, true, true, true, true, true, false];
const wd = document.getElementById('weekDots');
days.forEach((d, i) => {
  const dot = document.createElement('div');
  dot.className = 'week-dot' + (filled[i] ? ' filled' : '') + (i === 5 ? ' today' : '');
  dot.innerHTML = `<span class="dot-emoji">${filled[i] || i === 5 ? emojis[i] : ''}</span><span>${d}</span>`;
  wd.appendChild(dot);
});

// ── Leaderboard ──
const leaders = [
  { name: 'You', xp: 2450, emoji: '👑', rank: 1 },
  { name: 'Mom', xp: 2100, emoji: '🌸', rank: 2 },
  { name: 'Sis', xp: 1880, emoji: '💅', rank: 3 },
  { name: 'BFF', xp: 1200, emoji: '🦋', rank: 4 },
];
const lb = document.getElementById('leaderboard');
leaders.forEach(l => {
  const el = document.createElement('div');
  el.style.cssText = 'display:flex;align-items:center;gap:0.8rem;background:var(--bg);border-radius:14px;padding:0.8rem 1rem;border:1.5px solid var(--border);';
  const medal = ['🥇', '🥈', '🥉', '4️⃣'][l.rank - 1];
  el.innerHTML = `
    <span style="font-size:1.1rem">${medal}</span>
    <span style="font-size:1.2rem">${l.emoji}</span>
    <span style="font-weight:600;flex:1;font-size:0.9rem">${l.name}</span>
    <span style="font-family:'Caveat',cursive;font-size:1rem;color:var(--rose)">⚡ ${l.xp.toLocaleString()} XP</span>
  `;
  if (l.rank === 1) el.style.background = 'linear-gradient(135deg,rgba(255,61,127,0.08),rgba(192,132,252,0.08))';
  lb.appendChild(el);
});

// ── Wellness ──
let water = 6, steps = 7240, weight = 62.4;
function logWellness(type) {
  if (type === 'water') {
    water = Math.min(8, water + 1);
    document.getElementById('waterVal').textContent = water;
    document.getElementById('waterBar').style.width = (water / 8 * 100) + '%';
    if (water === 8) { setXP(totalXP + 20); showToast('💧 Hydration goal hit! +20 XP'); }
  } else if (type === 'steps') {
    steps = Math.min(10000, steps + 500);
    document.getElementById('stepsVal').textContent = steps.toLocaleString();
    document.getElementById('stepsBar').style.width = (steps / 10000 * 100) + '%';
    if (steps >= 10000) { setXP(totalXP + 30); showToast('👟 Step goal crushed! +30 XP'); }
  } else {
    weight = +(weight - 0.1).toFixed(1);
    document.getElementById('weightVal').textContent = weight;
  }
  setXP(totalXP + 2);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:0.7rem 1.4rem;font-weight:600;font-size:0.88rem;box-shadow:0 8px 32px rgba(255,110,180,0.2);z-index:9999;animation:fadeUp 0.3s ease both;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// Water chart
const waterData = [5, 7, 6, 8, 4, 7, 6];
const wDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const wChart = document.getElementById('waterChart');
wChart.style.display = 'contents';
waterData.forEach((v, i) => {
  const col = document.createElement('div');
  col.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;';
  const bar = document.createElement('div');
  bar.style.cssText = `width:100%;border-radius:6px 6px 0 0;background:linear-gradient(180deg,var(--pink),var(--rose));transition:height 1.5s ease;height:${v / 8 * 70}px;`;
  const lbl = document.createElement('div');
  lbl.style.cssText = 'font-size:0.6rem;color:var(--muted);';
  lbl.textContent = wDays[i];
  const val = document.createElement('div');
  val.style.cssText = 'font-size:0.65rem;font-weight:600;color:var(--rose);';
  val.textContent = v;
  col.appendChild(val); col.appendChild(bar); col.appendChild(lbl);
  wChart.appendChild(col);
});

// ── Scroll reveal ──
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => obs.observe(el));

// ── Countdown ──
function updateCountdown() {
  let remaining = 3 * 24 * 3600 + 14 * 3600 + 22 * 60;
  remaining -= Math.floor((Date.now() / 1000) % (4 * 24 * 3600));
  const d = Math.floor(remaining / 86400), h = Math.floor((remaining % 86400) / 3600), m = Math.floor((remaining % 3600) / 60);
  const el = document.getElementById('countdown');
  if (el) el.textContent = `${d}d ${h}h ${m}m`;
}
updateCountdown(); setInterval(updateCountdown, 60000);

// Initial sample goal
setTimeout(() => {
  document.getElementById('goalInput').value = 'Drink 8 glasses of water';
  addGoal();
  document.getElementById('goalInput').value = 'Morning walk 🌅';
  document.querySelectorAll('.emoji-btn')[3].click();
  xpSlider.value = 80; xpDisplay.textContent = '80 XP';
  document.querySelectorAll('.cat-btn')[1].click();
  addGoal();
  xpSlider.value = 50; xpDisplay.textContent = '50 XP';
  document.querySelectorAll('.emoji-btn')[0].click();
  document.querySelectorAll('.cat-btn')[0].click();
}, 600);