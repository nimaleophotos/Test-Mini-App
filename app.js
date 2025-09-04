/* Theme persistence */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('lens-theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
  themeToggle.checked = savedTheme === 'dark';
} else {
  // Prefer OS setting
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  themeToggle.checked = prefersDark;
}
themeToggle.addEventListener('change', () => {
  const next = themeToggle.checked ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('lens-theme', next);
});

/* Tabs */
const tabs = [
  { btn: 'tabBtn-leaderboard', panel: 'tab-leaderboard' },
  { btn: 'tabBtn-pod', panel: 'tab-pod' },
  { btn: 'tabBtn-tutorial', panel: 'tab-tutorial' }
];
tabs.forEach(({ btn, panel }) => {
  const b = document.getElementById(btn);
  const p = document.getElementById(panel);
  b.addEventListener('click', () => {
    tabs.forEach(({ btn: b2, panel: p2 }) => {
      document.getElementById(b2).classList.toggle('is-active', b2 === btn);
      document.getElementById(b2).setAttribute('aria-selected', b2 === btn ? 'true' : 'false');
      document.getElementById(p2).hidden = p2 !== panel;
    });
  });
});

/* Connect Wallet (new page) */
const connectWalletBtn = document.getElementById('connectWalletBtn');
connectWalletBtn.addEventListener('click', () => {
  // Placeholder page opens in a new tab
  window.open('connect-wallet.html', '_blank', 'noopener');
});

/* Camera button */
const cameraBtn = document.getElementById('cameraBtn');
const cameraInput = document.getElementById('cameraInput');
cameraBtn.addEventListener('click', () => {
  // Triggers native camera (where supported) via file input
  cameraInput.click();
});
cameraInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (file) {
    // Demo: preview captured image as POD
    const url = URL.createObjectURL(file);
    document.getElementById('podImage').src = url;
    document.getElementById('podTitle').textContent = 'Your Capture';
    document.getElementById('podArtist').textContent = 'You';
    document.getElementById('podDesc').textContent = 'Captured via LENS App Camera.';
  }
});

/* Mock data: POD */
const podImage = document.getElementById('podImage');
podImage.src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop';
document.getElementById('podTitle').textContent = 'Golden Hour Peaks';
document.getElementById('podArtist').textContent = 'A. Farcaster';
document.getElementById('podDesc').textContent = 'A serene mountain range soaked in warm evening light. Shot on 50mm prime.';

/* Spotlight Spots (3×3) */
const spotGrid = document.getElementById('spotGrid');
const spots = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  price: (i < 3) ? '5 $LENS' : (i < 6 ? '8 $LENS' : '12 $LENS'),
  owned: Math.random() < 0.33,
  img: `https://picsum.photos/seed/spot-${i+1}/400/300`
}));
function renderSpots() {
  spotGrid.innerHTML = '';
  spots.forEach(s => {
    const el = document.createElement('div');
    el.className = 'spot';
    el.innerHTML = `
      <img src="${s.img}" alt="Spot ${s.id}" />
      <div class="spot-meta">
        <span class="state">${s.owned ? 'Owned' : s.price}</span>
        <button class="buy-btn" ${s.owned ? 'disabled' : ''}>${s.owned ? '—' : 'Buy'}</button>
      </div>
    `;
    const btn = el.querySelector('.buy-btn');
    btn.addEventListener('click', () => {
      // Placeholder: simulate purchase
      if (!s.owned) {
        const ok = confirm(`Buy Spot ${s.id} for ${s.price}?`);
        if (ok) {
          s.owned = true;
          renderSpots();
          alert(`Spot ${s.id} purchased!`);
        }
      }
    });
    spotGrid.appendChild(el);
  });
}
renderSpots();

/* Leaderboard (Top 100 + current user rank) */
const leaderboardList = document.getElementById('leaderboardList');
const currentUserRankEl = document.getElementById('currentUserRank');

const users = Array.from({ length: 100 }).map((_, i) => ({
  name: `@photog_${String(i + 1).padStart(3, '0')}`,
  score: Math.floor(5000 - i * (Math.random() * 30 + 10))
}));
const currentUser = { name: '@you', score: Math.floor(1000 + Math.random() * 2000) };
users.push(currentUser);
users.sort((a, b) => b.score - a.score);
const top100 = users.slice(0, 100);

leaderboardList.innerHTML = top100.map((u, idx) => {
  const rank = idx + 1;
  return `<li>${rank}. ${u.name} — <span class="muted">${u.score} pts</span></li>`;
}).join('');

const currentRank = users.findIndex(u => u.name === currentUser.name) + 1;
currentUserRankEl.textContent = `Your Rank: #${currentRank} — ${currentUser.score} pts`;

/* Tutorials */
const tutorialGrid = document.getElementById('tutorialGrid');
const tutorials = [
  {
    title: 'Rule of Thirds',
    url: 'https://photographylife.com/what-is-the-rule-of-thirds',
    tasks: ['Compose a landscape using the grid', 'Shoot 3 variations']
  },
  {
    title: 'Understanding Exposure',
    url: 'https://www.cambridgeincolour.com/tutorials/camera-exposure.htm',
    tasks: ['Set manual mode', 'Shoot at ISO 100 & 800', 'Compare noise']
  },
  {
    title: 'Portrait Lighting Basics',
    url: 'https://www.masterclass.com/articles/portrait-lighting',
    tasks: ['Use window light', 'Try Rembrandt triangle']
  },
  {
    title: 'Street Photography Tips',
    url: 'https://www.magnumphotos.com/learn/street-photography/',
    tasks: ['Candid moments x5', 'Mind the background']
  },
  {
    title: 'Night Photography',
    url: 'https://www.nationalparksatnight.com/blog/2016/1/11/10-tips-for-night-photography',
    tasks: ['Tripod long exposure', 'Use remote or timer']
  },
  {
    title: 'Color Theory for Photographers',
    url: 'https://www.captureone.com/learn/color-theory',
    tasks: ['Complementary color shot', 'Analogous color shot']
  }
];
tutorials.forEach(t => {
  const card = document.createElement('article');
  card.className = 'tutorial-card';
  const id = `tasks-${t.title.toLowerCase().replace(/\s+/g, '-')}`;
  card.innerHTML = `
    <h3>${t.title}</h3>
    <p class="muted">Tap to open tutorial • Complete the tasks</p>
    <div class="card-actions">
      <a class="btn" href="${t.url}" target="_blank" rel="noopener">Open</a>
      <button class="btn" data-toggle="${id}">Tasks</button>
    </div>
    <ul id="${id}" class="muted" style="display:none; margin: 0; padding-left: 18px;"></ul>
  `;
  tutorialGrid.appendChild(card);
  const list = card.querySelector(`#${CSS.escape(id)}`);
  t.tasks.forEach(task => {
    const li = document.createElement('li');
    const checkboxId = `${id}-${Math.random().toString(36).slice(2,7)}`;
    li.innerHTML = `
      <label for="${checkboxId}">
        <input id="${checkboxId}" type="checkbox" /> ${task}
      </label>
    `;
    list.appendChild(li);
  });
  card.querySelector(`[data-toggle="${id}"]`).addEventListener('click', () => {
    list.style.display = list.style.display === 'none' ? 'block' : 'none';
  });
});

/* Accessibility: reduce motion respect */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Any animations would be toned down here (none used by default)
}

/* Notes:
 - Footer links (gallery/contest/rewards/info) and Connect Wallet open placeholder pages.
 - Replace URLs, wallet logic, and purchase flow with your production integrations (e.g., Farcaster Frames + wallet SDK).
*/
