/* ============================================================
   KAUÊ & GYOVANNA — app.js
   ============================================================ */

/* ---- CONSTANTS ---- */
const START_DATE = new Date('2025-06-20T20:30:00-03:00');
const INSTAGRAM = {
    kaue: { handle: '@ykauttiz', url: 'https://instagram.com/ykauttiz', name: 'Kauê', emoji: '👦🏻' },
    gyovanna: { handle: '@ymoraisxz_', url: 'https://instagram.com/ymoraisxz_', name: 'Gyovanna', emoji: '👧🏻' }
};

/* ---- STATE ---- */
let achievements = JSON.parse(localStorage.getItem('kg_ach') || '[]');
let msgLoves = parseInt(localStorage.getItem('kg_loves') || '0');
let totalHearts = parseInt(localStorage.getItem('kg_hearts') || '0');
let highScoreStars = parseInt(localStorage.getItem('kg_stars_hi') || '0');
let snakeHi = parseInt(localStorage.getItem('kg_snake_hi') || '0');
let typingBest = parseInt(localStorage.getItem('kg_typing_best') || '0');

/* ---- UTILS ---- */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const rnd = (a, b) => Math.random() * (b - a) + a;
const rndInt = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[rndInt(0, arr.length - 1)];

function saveAch() { localStorage.setItem('kg_ach', JSON.stringify(achievements)); }

function unlockAch(id) {
    if (achievements.includes(id)) return;
    achievements.push(id);
    saveAch();
    const card = document.querySelector(`.ach-card[data-id="${id}"]`);
    if (card) {
        card.classList.add('on');
        const nm = card.querySelector('.ach-nm')?.textContent || '';
        showToast(`🏆 Conquista: ${nm}`);
    }
    updateAchCount();
    spawnConfetti(16);
}

function unlockAllAch() {
    $$('.ach-card').forEach(c => {
        const id = c.dataset.id;
        if (!achievements.includes(id)) unlockAch(id);
    });
}

function updateAchCount() {
    const total = $$('.ach-card').length;
    const done = achievements.length;
    const el = $('ach-count');
    if (el) el.textContent = done;
    const sub = $('ach-sub-txt');
    if (sub) sub.textContent = `de ${total} conquistas desbloqueadas`;
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'ach-unlock-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

/* ---- CONFETTI ---- */
function spawnConfetti(n = 30) {
    const colors = ['#e8647a', '#f0a0b0', '#c9956e', '#9b7ccd', '#6ab0e8', '#e8c4a0'];
    for (let i = 0; i < n; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'confetti';
            const size = rnd(6, 14);
            el.style.cssText = `
        left:${rnd(10, 90)}vw; top:-20px;
        width:${size}px; height:${size}px;
        background:${pick(colors)};
        --dur:${rnd(1.5, 3)}s;
        --sy:-${rnd(50, 150)}px;
        border-radius:${Math.random() > .5 ? '50%' : '2px'};
      `;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3500);
        }, i * 60);
    }
}

/* ---- LOADING ---- */
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const ld = $('loading');
        if (ld) ld.classList.add('done');
    }, 2000);
    init();
});

function init() {
    initCounter();
    initNav();
    initHeroCanvas();
    initReveal();
    initQuotesTicker();
    initGallery();
    initSkyStars();
    initFooterCanvas();
    initKonami();
    initGames();
    initAchievements();
    updateAchCount();
    $('msg-love-count').textContent = msgLoves;
    document.addEventListener('keydown', handleKeyInput);
}

/* ---- COUNTER ---- */
function initCounter() {
    function update() {
        const now = new Date();
        let y = 0, mo = 0, d = 0, h, m, s;
        let from = new Date(START_DATE);
        y = now.getFullYear() - from.getFullYear();
        mo = now.getMonth() - from.getMonth();
        if (mo < 0) { y--; mo += 12; }
        let tmp = new Date(from);
        tmp.setFullYear(from.getFullYear() + y);
        tmp.setMonth(from.getMonth() + mo);
        d = Math.floor((now - tmp) / 86400000);
        const total_s = Math.floor((now - START_DATE) / 1000);
        h = Math.floor((total_s % 86400) / 3600);
        m = Math.floor((total_s % 3600) / 60);
        s = total_s % 60;
        $('c-y').textContent = y;
        $('c-mo').textContent = mo;
        $('c-d').textContent = d;
        $('c-h').textContent = String(h).padStart(2, '0');
        $('c-m').textContent = String(m).padStart(2, '0');
        $('c-s').textContent = String(s).padStart(2, '0');
        updateRetro(y, mo, d, total_s);
    }
    update();
    setInterval(update, 1000);
}

function updateRetro(y, mo, d, total_s) {
    const days = Math.floor(total_s / 86400);
    const el = {
        days: $('retro-days'),
        hours: $('retro-hours'),
        msgs: $('retro-msgs'),
        update: $('retro-update-time')
    };
    if (el.days) el.days.textContent = days;
    if (el.hours) el.hours.textContent = (Math.floor(total_s / 3600)).toLocaleString('pt-BR');
    if (el.msgs) el.msgs.textContent = (days * 47 + 312).toLocaleString('pt-BR');
    if (el.update) el.update.textContent = 'Atualizado agora mesmo ✨';
}

/* ---- NAV ---- */
function initNav() {
    const nav = $('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    });

    // active link on scroll
    const sections = ['hero', 'story', 'music', 'sky', 'games', 'gallery', 'achievements', 'retro'];
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                $$('.nav-links a').forEach(a => {
                    a.classList.toggle('active-link', a.getAttribute('href') === '#' + e.target.id);
                });
            }
        });
    }, { threshold: .35 });
    sections.forEach(id => { const el = $(id); if (el) observer.observe(el); });

    // mobile
    const toggle = $('nav-toggle');
    const mobile = $('nav-mobile');
    if (toggle && mobile) {
        toggle.addEventListener('click', () => mobile.classList.toggle('open'));
        $$('.nav-mobile a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));
    }
}

/* ---- HERO CANVAS (particles + hearts) ---- */
function initHeroCanvas() {
    const canvas = $('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // spawn particles
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.8 + .4,
            vx: (Math.random() - .5) * .25,
            vy: (Math.random() - .5) * .25,
            alpha: Math.random() * .8 + .2,
            color: pick(['#e8647a', '#f0a0b0', '#c4a8f0', '#6ab0e8', '#e8c4a0'])
        });
    }

    // floating hearts
    const hearts = [];
    setInterval(() => {
        if (hearts.length < 12) hearts.push({
            x: rnd(.1, .9) * canvas.width, y: canvas.height + 20,
            vy: rnd(.4, .9), size: rnd(12, 22),
            alpha: 1, symbol: pick(['♡', '❤', '💕', '✨'])
        });
    }, 1200);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.save();
            ctx.globalAlpha = p.alpha * .6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
        });
        hearts.forEach((h, i) => {
            h.y -= h.vy;
            h.alpha -= .003;
            if (h.alpha <= 0) { hearts.splice(i, 1); return; }
            ctx.save();
            ctx.globalAlpha = h.alpha * .4;
            ctx.fillStyle = '#e8647a';
            ctx.font = `${h.size}px serif`;
            ctx.fillText(h.symbol, h.x, h.y);
            ctx.restore();
        });
        requestAnimationFrame(draw);
    }
    draw();

    // click to burst hearts
    canvas.addEventListener('click', e => {
        const rect = canvas.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = pick(['💕', '❤️', '✨', '💖', '🌸']);
            heart.style.left = (e.clientX - rect.left + rnd(-30, 30)) + 'px';
            heart.style.top = (e.clientY - rect.top) + 'px';
            heart.style.position = 'absolute';
            canvas.parentElement.appendChild(heart);
            setTimeout(() => heart.remove(), 2600);
        }
    });
}

/* ---- FOOTER CANVAS ---- */
function initFooterCanvas() {
    const canvas = $('footer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    const pts = [];
    for (let i = 0; i < 40; i++) pts.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + .3, a: Math.random() * .5 + .1 });
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pts.forEach(p => {
            ctx.save(); ctx.globalAlpha = p.a * .4;
            ctx.beginPath(); ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r, 0, Math.PI * 2);
            ctx.fillStyle = '#e8647a'; ctx.fill(); ctx.restore();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

/* ---- REVEAL ON SCROLL ---- */
function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .12 });
    $$('.reveal').forEach(el => obs.observe(el));
}

/* ---- QUOTES TICKER ---- */
const QUOTES = [
    { text: 'Você é meu lar preferido', icon: '🏠' },
    { text: 'Escorpião nos assistiu se apaixonar', icon: '🦂' },
    { text: 'G + K — Saturno', icon: '🪐' },
    { text: '20 de junho de 2025', icon: '📅' },
    { text: 'Anápolis, Goiás', icon: '📍' },
    { text: 'Eu te amo, Gyovanna', icon: '❤️' },
    { text: 'Cada segundo com você é presente', icon: '🎁' },
    { text: 'O universo conspirou pra nos juntar', icon: '✨' },
    { text: 'Antares brilhou por nós', icon: '⭐' },
    { text: 'Para sempre aqui', icon: '♾️' },
    { text: 'Você é a melhor parte do meu dia', icon: '🌅' },
    { text: 'Te amo de um jeito que não cabe em texto', icon: '💕' },
];

function initQuotesTicker() {
    const inner = $('quotes-inner');
    if (!inner) return;
    const doubled = [...QUOTES, ...QUOTES];
    inner.innerHTML = doubled.map(q =>
        `<span class="quote-item"><span class="q-icon">${q.icon}</span>${q.text}</span>`
    ).join('');
}

/* ---- GALLERY ---- */
const GALLERY_LABELS = [
    'Nosso primeiro sorriso juntos 🌸',
    'O dia mais especial ❤️',
    'Meu amor eterno 💕',
    'Você, simplesmente você ✨',
];
let lbIndex = 0;
let galleryImgs = [];

function initGallery() {
    const scroll = $('gallery-scroll');
    if (!scroll) return;

    // drag scroll
    let isDown = false, startX, sl;
    scroll.addEventListener('mousedown', e => { isDown = true; scroll.classList.add('dragging'); startX = e.pageX - scroll.offsetLeft; sl = scroll.scrollLeft; });
    scroll.addEventListener('mouseleave', () => { isDown = false; scroll.classList.remove('dragging'); });
    scroll.addEventListener('mouseup', () => { isDown = false; scroll.classList.remove('dragging'); });
    scroll.addEventListener('mousemove', e => {
        if (!isDown) return; e.preventDefault();
        const x = e.pageX - scroll.offsetLeft;
        scroll.scrollLeft = sl - (x - startX) * 1.2;
    });

    // gather images
    galleryImgs = Array.from($$('.g-card img')).map(i => i.src);
    // dots
    const dotsEl = $('g-dots');
    if (dotsEl) {
        dotsEl.innerHTML = galleryImgs.map((_, i) => `<button class="g-dot${i === 0 ? ' active' : ''}" onclick="scrollGallery(${i})"></button>`).join('');
    }
    scroll.addEventListener('scroll', () => {
        const w = scroll.offsetWidth;
        const idx = Math.round(scroll.scrollLeft / w);
        $$('.g-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    });
}

function scrollGallery(i) {
    const scroll = $('gallery-scroll');
    if (!scroll) return;
    const card = scroll.querySelectorAll('.g-card')[i];
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}

function openLb(src, idx) {
    lbIndex = idx;
    const lb = $('lightbox');
    lb.classList.add('open');
    $('lb-img').src = src;
    unlockAch('gallery');
}

function closeLb() { $('lightbox').classList.remove('open'); }
function lbNav(dir) {
    lbIndex = (lbIndex + dir + galleryImgs.length) % galleryImgs.length;
    $('lb-img').src = galleryImgs[lbIndex];
}

document.addEventListener('keydown', e => {
    if ($('lightbox').classList.contains('open')) {
        if (e.key === 'ArrowRight') lbNav(1);
        if (e.key === 'ArrowLeft') lbNav(-1);
        if (e.key === 'Escape') closeLb();
    }
});

/* ---- MESSAGE ---- */
function toggleMsg() {
    const full = $('msg-full');
    const btn = $('msg-btn');
    const isOpen = full.classList.toggle('open');
    btn.innerHTML = isOpen
        ? '💌 Esconder mensagem'
        : '💌 Mostrar mensagem completa';
    if (isOpen) { unlockAch('message'); spawnConfetti(12); }
}

function loveMsg() {
    msgLoves++;
    localStorage.setItem('kg_loves', msgLoves);
    $('msg-love-count').textContent = msgLoves;
    const btn = $('msg-love-btn');
    btn.classList.add('loved');
    setTimeout(() => btn.classList.remove('loved'), 500);
    spawnFloatingHeart();
    if (msgLoves >= 10) unlockAch('love10');
    if (msgLoves >= 50) unlockAch('love50');
}

function spawnFloatingHeart() {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = pick(['💕', '❤️', '💖', '🌸', '✨']);
    h.style.cssText = `left:${rnd(20, 80)}vw;bottom:${rnd(20, 40)}vh;z-index:3000;`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2500);
}

/* ---- SKY STARS ---- */
function initSkyStars() {
    const svg = $('sky-svg');
    const tooltip = $('star-tooltip');
    if (!svg || !tooltip) return;
    $$('.sky-star').forEach(g => {
        g.addEventListener('mouseenter', e => {
            tooltip.innerHTML = `<strong>${g.dataset.name || ''}</strong>${g.dataset.info || ''}<div class="mag">Magnitude: ${g.dataset.mag || '?'}</div>`;
            tooltip.classList.add('show');
            unlockAch('sky');
        });
        g.addEventListener('mousemove', e => {
            const rect = svg.closest('.sky-svg-container').getBoundingClientRect();
            tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
            tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
        });
        g.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
        g.addEventListener('click', () => {
            g.classList.toggle('active');
            spawnConfetti(8);
        });
    });
}

/* ---- ACHIEVEMENTS ---- */
const ACH_DATA = [
    { id: 'visitor', ic: '👀', nm: 'Primeira visita' },
    { id: 'sky', ic: '⭐', nm: 'Explorador estelar' },
    { id: 'gallery', ic: '📸', nm: 'Amante de fotos' },
    { id: 'message', ic: '💌', nm: 'Leu a carta' },
    { id: 'wordle', ic: '🔤', nm: 'Mestre das palavras' },
    { id: 'memory', ic: '🃏', nm: 'Memória perfeita' },
    { id: 'quiz', ic: '📝', nm: 'Quiz mestre' },
    { id: 'ttt', ic: '❌', nm: 'Tic Tac Toe' },
    { id: 'dice6', ic: '🎲', nm: 'Tiro certeiro' },
    { id: 'love10', ic: '💕', nm: '10 corações' },
    { id: 'love50', ic: '💖', nm: '50 corações' },
    { id: 'stars50', ic: '⭐', nm: '50 estrelas' },
    { id: 'snake20', ic: '🐍', nm: 'Cobra veloz' },
    { id: 'typing60', ic: '⌨️', nm: 'Digitador' },
    { id: 'wheel', ic: '🎡', nm: 'Girou a roda' },
    { id: 'pairs', ic: '💑', nm: 'Pares encontrados' },
    { id: 'challenge', ic: '💘', nm: 'Desafio aceito' },
    { id: 'konami', ic: '🕹️', nm: 'Konami code' },
    { id: 'secret', ic: '🔮', nm: 'Segredo revelado' },
    { id: 'all', ic: '👑', nm: 'Completou tudo' },
];

function initAchievements() {
    const grid = $('ach-grid');
    if (!grid) return;
    grid.innerHTML = ACH_DATA.map(a => `
    <div class="ach-card${achievements.includes(a.id) ? ' on' : ''}" data-id="${a.id}" title="${a.nm}">
      <span class="ach-ic">${a.ic}</span>
      <div class="ach-nm">${a.nm}</div>
    </div>
  `).join('');
    unlockAch('visitor');
}

/* ---- KONAMI ---- */
const KONAMI_SEQ = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a'.split(',');
let konamiPos = 0;
function handleKeyInput(e) {
    if (e.key === KONAMI_SEQ[konamiPos]) {
        konamiPos++;
        if (konamiPos === KONAMI_SEQ.length) {
            konamiPos = 0;
            unlockAch('konami');
            openSecret('konami');
        }
    } else { konamiPos = 0; }
}

/* ---- SECRET OVERLAY ---- */
const SECRET_MSGS = {
    konami: {
        title: '🕹️ Código Secreto!',
        msg: 'Você descobriu o Konami Code! Como prêmio, aqui vai uma verdade: cada vez que você sorri, eu fico sem fôlego. Te amo demais, Gyovanna. 💕'
    },
    cheat: {
        title: '✨ Cheat Ativado!',
        msg: 'Todas as conquistas desbloqueadas! Mas a maior conquista foi você entrar na minha vida. 👑'
    }
};

function openSecret(type) {
    const data = SECRET_MSGS[type] || SECRET_MSGS.konami;
    $('secret-title').textContent = data.title;
    $('secret-msg').textContent = data.msg;
    const overlay = $('secret-overlay');
    overlay.classList.add('show');
    // spawn hearts
    const hc = $('secret-hearts');
    hc.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const h = document.createElement('div');
        h.className = 'secret-heart';
        h.textContent = pick(['❤️', '💕', '💖', '✨', '🌸']);
        h.style.cssText = `left:${rnd(5, 90)}%;bottom:0;animation-delay:${rnd(0, 2)}s;`;
        hc.appendChild(h);
    }
    unlockAch('secret');
    spawnConfetti(30);
}

function closeSecret() { $('secret-overlay').classList.remove('show'); }

/* ---- CHEAT CODE OVERLAY ---- */
const CHEAT_CODE = 'KAUEAMAGYOVANNA';
let cheatInput = '';
document.addEventListener('keydown', e => {
    if (e.key.length === 1) {
        cheatInput = (cheatInput + e.key.toUpperCase()).slice(-CHEAT_CODE.length);
        if (cheatInput === CHEAT_CODE) openCheat();
    }
});

function openCheat() {
    $('cheat-overlay').classList.add('show');
    unlockAch('secret');
}
function closeCheat() { $('cheat-overlay').classList.remove('show'); }
function cheatUnlockAll() {
    unlockAllAch();
    spawnConfetti(60);
    showToast('👑 Todas as conquistas desbloqueadas!');
    closeCheat();
    openSecret('cheat');
}

/* ================================================================
   GAMES
   ================================================================ */
function switchGame(idx, btn) {
    $$('.gtab').forEach(t => t.classList.remove('active'));
    $$('.gpanel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $(`gp-${idx}`).classList.add('active');
}

/* ---- WORDLE ---- */
const WORDLE_WORDS = ['TUDO', 'AMOR', 'BESO', 'LUNA', 'ROSA', 'ALMA', 'DOCE', 'LUAR', 'FLOR', 'PURO'];
let wWord, wRow, wCol, wGuesses, wDone, wKeyMap;

function initWordle() {
    wWord = pick(WORDLE_WORDS);
    wRow = 0; wCol = 0; wDone = false; wGuesses = Array(6).fill('').map(() => Array(4).fill(''));
    wKeyMap = {};
    const board = $('w-board');
    board.innerHTML = '';
    for (let r = 0; r < 6; r++) {
        const row = document.createElement('div'); row.className = 'w-row';
        for (let c = 0; c < 4; c++) {
            const tile = document.createElement('div'); tile.className = 'w-tile';
            tile.id = `wt-${r}-${c}`; row.appendChild(tile);
        }
        board.appendChild(row);
    }
    $('w-status').textContent = '';
    $('w-win').style.display = 'none';
    $('w-lose').style.display = 'none';
    $('w-again').style.display = 'none';
    buildKeyboard();
}

function buildKeyboard() {
    const rows = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']];
    const kb = $('w-kb'); kb.innerHTML = '';
    rows.forEach(row => {
        const div = document.createElement('div'); div.className = 'w-kb-row';
        row.forEach(k => {
            const btn = document.createElement('button'); btn.className = 'w-key' + (k.length > 1 ? ' wide' : '');
            btn.textContent = k; btn.dataset.key = k;
            if (k === 'ENTER') btn.classList.add('enter-key');
            btn.addEventListener('click', () => wHandleKey(k));
            div.appendChild(btn);
        });
        kb.appendChild(div);
    });
}

document.addEventListener('keydown', e => {
    const panel = $('gp-0');
    if (!panel || !panel.classList.contains('active')) return;
    if (e.ctrlKey || e.metaKey) return;
    if (e.key === 'Enter') wHandleKey('ENTER');
    else if (e.key === 'Backspace') wHandleKey('⌫');
    else if (/^[a-zA-Z]$/.test(e.key)) wHandleKey(e.key.toUpperCase());
});

function wHandleKey(k) {
    if (wDone) return;
    if (k === '⌫') {
        if (wCol > 0) { wCol--; wGuesses[wRow][wCol] = ''; document.getElementById(`wt-${wRow}-${wCol}`).textContent = ''; document.getElementById(`wt-${wRow}-${wCol}`).classList.remove('filled'); }
    } else if (k === 'ENTER') {
        if (wCol < 4) { wShake(); return; }
        wSubmit();
    } else if (wCol < 4) {
        wGuesses[wRow][wCol] = k;
        const t = document.getElementById(`wt-${wRow}-${wCol}`);
        t.textContent = k; t.classList.add('filled', 'bounce-in');
        wCol++;
    }
}

function wShake() {
    for (let c = 0; c < 4; c++) document.getElementById(`wt-${wRow}-${c}`).classList.add('shake');
    setTimeout(() => { for (let c = 0; c < 4; c++) document.getElementById(`wt-${wRow}-${c}`).classList.remove('shake'); }, 500);
}

function wSubmit() {
    const guess = wGuesses[wRow].join('');
    const target = wWord;
    const result = Array(4).fill('absent');
    const used = Array(4).fill(false);
    // correct pass
    for (let i = 0; i < 4; i++) if (guess[i] === target[i]) { result[i] = 'correct'; used[i] = true; }
    // present pass
    for (let i = 0; i < 4; i++) {
        if (result[i] === 'correct') continue;
        for (let j = 0; j < 4; j++) {
            if (!used[j] && result[j] !== 'correct' && guess[i] === target[j]) { result[i] = 'present'; used[j] = true; break; }
        }
    }
    result.forEach((res, c) => {
        const t = document.getElementById(`wt-${wRow}-${c}`);
        setTimeout(() => {
            t.classList.remove('filled');
            t.classList.add(`flip-${res}`);
            updateWKey(guess[c], res);
        }, c * 120);
    });
    const won = result.every(r => r === 'correct');
    setTimeout(() => {
        if (won) {
            $('w-win').style.display = 'block';
            $('w-again').style.display = 'block';
            wDone = true;
            spawnConfetti(40);
            unlockAch('wordle');
        } else if (wRow === 5) {
            $('w-lose').style.display = 'block';
            $('w-again').style.display = 'block';
            $('w-lose').querySelector('p').innerHTML = `A palavra era: <strong>${wWord}</strong><br>Porque eu amo tudo em você, Gyovanna! 💕`;
            wDone = true;
        } else {
            wRow++; wCol = 0;
        }
    }, 600);
}

function updateWKey(letter, status) {
    const priority = { correct: 3, present: 2, absent: 1 };
    const key = document.querySelector(`.w-key[data-key="${letter}"]`);
    if (!key) return;
    const cur = priority[wKeyMap[letter]] || 0;
    if (priority[status] > cur) { key.className = 'w-key' + (letter.length > 1 ? ' wide' : ''); key.classList.add(status); wKeyMap[letter] = status; }
}

function resetWordle() { initWordle(); }

/* ---- MEMORY ---- */
const MEM_EMOJIS = ['💕', '❤️', '🌸', '✨', '🦋', '🎵', '🌙', '🪐'];
let memCards, memFlipped, memMatched, memMoves, memTimer, memInterval;

function initMemory() {
    clearInterval(memInterval);
    const pairs = [...MEM_EMOJIS, ...MEM_EMOJIS].sort(() => Math.random() - .5);
    memFlipped = []; memMatched = 0; memMoves = 0; memTimer = 0;
    $('mem-moves').textContent = '0'; $('mem-time').textContent = '0:00'; $('mem-pairs').textContent = '0/8';
    $('mem-win').style.display = 'none';
    const board = $('mem-board'); board.innerHTML = '';
    memCards = pairs.map((emoji, i) => {
        const card = document.createElement('div'); card.className = 'mem-card';
        card.innerHTML = `<div class="mem-face mem-back"></div><div class="mem-face mem-front">${emoji}</div>`;
        card.dataset.emoji = emoji; card.dataset.idx = i;
        card.addEventListener('click', () => memClick(card));
        board.appendChild(card); return card;
    });
    memInterval = setInterval(() => {
        memTimer++;
        const m = Math.floor(memTimer / 60); const s = memTimer % 60;
        $('mem-time').textContent = `${m}:${String(s).padStart(2, '0')}`;
    }, 1000);
}

function memClick(card) {
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (memFlipped.length === 2) return;
    card.classList.add('flipped');
    memFlipped.push(card);
    if (memFlipped.length === 2) {
        memMoves++;
        $('mem-moves').textContent = memMoves;
        if (memFlipped[0].dataset.emoji === memFlipped[1].dataset.emoji) {
            memFlipped.forEach(c => c.classList.add('matched'));
            memMatched++;
            $('mem-pairs').textContent = `${memMatched}/8`;
            memFlipped = [];
            if (memMatched === 8) {
                clearInterval(memInterval);
                $('mem-win').style.display = 'block';
                $('mem-win').querySelector('p').textContent = `${memMoves} jogadas · ${$('mem-time').textContent} ⏱ Incrível! 💕`;
                spawnConfetti(50); unlockAch('memory');
            }
        } else {
            setTimeout(() => { memFlipped.forEach(c => c.classList.remove('flipped')); memFlipped = []; }, 900);
        }
    }
}

function resetMemory() { initMemory(); }

/* ---- QUIZ ---- */
const QUIZ_QS = [
    { q: 'Quando Kauê e Gyovanna começaram a namorar?', opts: ['20 de junho de 2025', '14 de fevereiro de 2025', '01 de janeiro de 2025', '20 de março de 2025'], ans: 0 },
    { q: 'Qual é a nossa música favorita?', opts: ['G + K — Saturno', 'Perfect — Ed Sheeran', 'All of Me — John Legend', 'Lover — Taylor Swift'], ans: 0 },
    { q: 'Em qual cidade ficamos juntos?', opts: ['Goiânia', 'Brasília', 'Anápolis', 'São Paulo'], ans: 2 },
    { q: 'Qual constelação nos assistiu se apaixonar?', opts: ['Orion', 'Escorpião', 'Cruzeiro do Sul', 'Gêmeos'], ans: 1 },
    { q: 'O que Kauê mais ama em Gyovanna?', opts: ['O sorriso dela', 'Os olhos dela', 'O jeito que ela ri', 'Tudo nela'], ans: 3 },
    { q: 'Qual estrela é o coração de Escorpião?', opts: ['Sirius', 'Antares', 'Acrux', 'Betelgeuse'], ans: 1 },
    { q: 'Qual é o estado do Brasil onde ficamos?', opts: ['Goiás', 'Minas Gerais', 'São Paulo', 'Bahia'], ans: 0 },
];
let quizIdx, quizScore;

function initQuiz() {
    quizIdx = 0; quizScore = 0;
    $('quiz-result').style.display = 'none';
    renderQuizQ();
}

function renderQuizQ() {
    const content = $('quiz-content');
    $('q-prog').style.width = `${(quizIdx / QUIZ_QS.length) * 100}%`;
    if (quizIdx >= QUIZ_QS.length) {
        content.style.display = 'none';
        const r = $('quiz-result'); r.style.display = 'block';
        $('q-score').textContent = quizScore;
        $('q-of').textContent = `de ${QUIZ_QS.length} acertos`;
        $('q-msg').textContent = quizScore === QUIZ_QS.length ? 'Perfeito! Você nos conhece de cor! 💕' :
            quizScore >= 4 ? 'Muito bem! Quase perfeito! ❤️' :
                quizScore >= 2 ? 'Bom esforço! Tente novamente! 🌸' : 'Continue tentando! A gente acredita em você! ✨';
        unlockAch('quiz');
        if (quizScore === QUIZ_QS.length) spawnConfetti(50);
        return;
    }
    const q = QUIZ_QS[quizIdx];
    const letters = ['A', 'B', 'C', 'D'];
    content.style.display = 'block';
    content.innerHTML = `
    <div class="quiz-q-num">Pergunta ${quizIdx + 1} de ${QUIZ_QS.length}</div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-opts">
      ${q.opts.map((o, i) => `
        <button class="quiz-opt" onclick="quizAnswer(${i})">
          <span class="quiz-opt-letter">${letters[i]}</span>${o}
        </button>
      `).join('')}
    </div>
  `;
}

function quizAnswer(idx) {
    const q = QUIZ_QS[quizIdx];
    const opts = $$('.quiz-opt');
    opts.forEach(o => o.disabled = true);
    opts[idx].classList.add(idx === q.ans ? 'correct' : 'wrong');
    if (idx === q.ans) { quizScore++; spawnConfetti(10); }
    else opts[q.ans].classList.add('correct');
    setTimeout(() => { quizIdx++; renderQuizQ(); }, 1200);
}

function resetQuiz() { initQuiz(); }

/* ---- TIC TAC TOE ---- */
let tttBoard, tttTurn, tttDone, tttScoreX = 0, tttScoreO = 0, tttScoreDraw = 0;
const WINS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function initTTT() {
    tttBoard = Array(9).fill(''); tttTurn = 'X'; tttDone = false;
    $$('.ttt-cell').forEach((c, i) => { c.textContent = ''; c.className = 'ttt-cell'; c.onclick = () => handleTTT(i); });
    $('tictactoe-status').textContent = 'Seu turno! (X 💕)';
    updateTTTScore();
}

function handleTTT(i) {
    if (tttDone || tttBoard[i]) return;
    tttBoard[i] = 'X';
    const cell = $$('.ttt-cell')[i]; cell.textContent = 'X'; cell.classList.add('x-cell');
    const w = checkWin('X');
    if (w) { endTTT('X', w); return; }
    if (tttBoard.every(c => c)) { endTTT('draw'); return; }
    tttTurn = 'O';
    $('tictactoe-status').textContent = 'IA pensando... 🤔';
    setTimeout(() => tttAI(), 500);
}

function tttAI() {
    // minimax
    const best = minimax(tttBoard, 'O');
    tttBoard[best.idx] = 'O';
    const cell = $$('.ttt-cell')[best.idx]; cell.textContent = 'O'; cell.classList.add('o-cell');
    const w = checkWin('O');
    if (w) { endTTT('O', w); return; }
    if (tttBoard.every(c => c)) { endTTT('draw'); return; }
    tttTurn = 'X';
    $('tictactoe-status').textContent = 'Seu turno! (X 💕)';
}

function minimax(board, player) {
    const opp = player === 'O' ? 'X' : 'O';
    const w = checkWin('O', board); if (w) return { score: 10 };
    const lw = checkWin('X', board); if (lw) return { score: -10 };
    if (board.every(c => c)) return { score: 0 };
    const moves = [];
    board.forEach((_, i) => {
        if (board[i]) return;
        const nb = [...board]; nb[i] = player;
        const res = minimax(nb, opp);
        moves.push({ idx: i, score: res.score });
    });
    return player === 'O'
        ? moves.reduce((a, b) => b.score > a.score ? b : a)
        : moves.reduce((a, b) => b.score < a.score ? b : a);
}

function checkWin(p, board = tttBoard) {
    return WINS.find(combo => combo.every(i => board[i] === p)) || null;
}

function endTTT(winner, combo) {
    tttDone = true;
    if (winner === 'draw') {
        $('tictactoe-status').textContent = "Empate! 🤝";
        tttScoreDraw++;
    } else {
        combo.forEach(i => $$('.ttt-cell')[i].classList.add('win-cell'));
        $('tictactoe-status').textContent = winner === 'X' ? 'Você ganhou! 🎉 Mais esperta que a IA!' : 'A IA ganhou! 🤖 Tente de novo!';
        if (winner === 'X') { tttScoreX++; spawnConfetti(20); unlockAch('ttt'); }
        else tttScoreO++;
    }
    updateTTTScore();
    setTimeout(() => resetTTT(), 2500);
}

function updateTTTScore() {
    const el = $('ttt-score');
    if (el) el.innerHTML = `Você: <span>${tttScoreX}</span> · IA: <span>${tttScoreO}</span> · Empates: <span>${tttScoreDraw}</span>`;
}

function resetTTT() { initTTT(); }

/* ---- DICE ---- */
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const DICE_MSGS = ['Que pena, baixo!', 'Quase!', 'Mediano...', 'Bom resultado!', 'Muito bom!', 'MÁXIMO! 🎉'];
let diceTotal = 0, diceBest = 0, diceRolls = 0;

function rollDice() {
    const dice = $('dice');
    dice.classList.add('rolling');
    setTimeout(() => {
        dice.classList.remove('rolling');
        const val = rndInt(1, 6);
        dice.textContent = DICE_FACES[val - 1];
        diceTotal += val; diceRolls++;
        if (val > diceBest) diceBest = val;
        $('dice-last').textContent = val;
        $('dice-best').textContent = diceBest;
        $('dice-total').textContent = diceTotal;
        $('dice-result').textContent = DICE_MSGS[val - 1];
        if (val === 6) { spawnConfetti(20); unlockAch('dice6'); }
    }, 600);
}

/* ---- HEARTS GAME ---- */
let heartCount = 0, heartCombo = 0, heartTimeout, heartLevel = 0;
const HEART_LEVELS = ['Aquecendo...', 'Carinhoso', 'Apaixonado', 'Intenso', 'AMOR TOTAL 💕'];

function clickHeart() {
    heartCount++; heartCombo++;
    totalHearts += 1; localStorage.setItem('kg_hearts', totalHearts);
    clearTimeout(heartTimeout);
    heartTimeout = setTimeout(() => heartCombo = 0, 1500);
    heartLevel = Math.min(4, Math.floor(heartCombo / 5));
    $('hearts-display').textContent = heartCount;
    $('combo-count').textContent = heartCombo;
    const lvl = $('hearts-level'); if (lvl) lvl.textContent = HEART_LEVELS[heartLevel];
    spawnFloatingHeart();
    if (heartCombo === 10) showToast('🔥 Combo x10!');
    if (heartCombo === 25) showToast('💥 Combo INCRÍVEL x25!');
    if (totalHearts >= 10) unlockAch('love10');
    if (totalHearts >= 50) unlockAch('love50');
}

function resetHearts() { heartCount = 0; heartCombo = 0; $('hearts-display').textContent = 0; $('combo-count').textContent = 0; }

/* ---- STARS GAME ---- */
let starsScore = 0, starsTime = 30, starsInterval, starsSpawn;

function initStars() {
    starsScore = 0; starsTime = 30;
    clearInterval(starsInterval); clearInterval(starsSpawn);
    $('stars-score').textContent = 0; $('stars-time').textContent = 30;
    if ($('stars-hi')) $('stars-hi').textContent = highScoreStars;
    const field = $('stars-field'); field.innerHTML = '';
    starsInterval = setInterval(() => {
        starsTime--; $('stars-time').textContent = starsTime;
        if (starsTime <= 0) {
            clearInterval(starsInterval); clearInterval(starsSpawn); field.innerHTML = '<p style="color:var(--muted);padding:2rem;font-size:1.1rem">Tempo esgotado! Score: ' + starsScore + ' ⭐</p>';
            if (starsScore > highScoreStars) { highScoreStars = starsScore; localStorage.setItem('kg_stars_hi', starsScore); }
            if (starsScore >= 50) unlockAch('stars50');
        }
    }, 1000);
    starsSpawn = setInterval(addStar, 600);
}

function addStar() {
    const field = $('stars-field');
    if (field.querySelectorAll('.star-item').length > 14) return;
    const star = document.createElement('div'); star.className = 'star-item';
    const icons = ['⭐', '🌟', '💫', '✨', '🌠'];
    star.textContent = pick(icons);
    star.style.cssText = `left:${rnd(5, 85)}%;top:${rnd(5, 85)}%;animation-delay:${rnd(0, 1)}s;`;
    star.addEventListener('click', () => {
        starsScore++; $('stars-score').textContent = starsScore;
        spawnParticles(star); star.remove();
    });
    field.appendChild(star);
    setTimeout(() => { if (star.parentNode) star.remove(); }, 2500);
}

function spawnParticles(el) {
    const rect = el.getBoundingClientRect();
    const colors = ['#e8647a', '#f0a0b0', '#c4a8f0', '#e8c4a0'];
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top}px;width:6px;height:6px;border-radius:50%;background:${pick(colors)};pointer-events:none;z-index:3000;--tx:${rnd(-40, 40)}px;--ty:${rnd(-60, -20)}px;animation:particle-fly .7s ease forwards;`;
        document.body.appendChild(p); setTimeout(() => p.remove(), 800);
    }
}

function resetStars() { initStars(); }

/* ---- FORTUNE WHEEL ---- */
const WHEEL_ITEMS = ['Beijo 💋', 'Abraço 🤗', 'Eu te amo ❤️', 'Surpreenda-me ✨', 'Música juntos 🎵', 'Dança comigo 💃', 'Cozinhar juntos 🍳', 'Passeio 🌅', 'Mensagem fofa 💌', 'Contar histórias 📖'];
let wheelSpinning = false;

function initWheel() {
    const canvas = $('wheel-canvas');
    if (!canvas) return;
    canvas.width = 300; canvas.height = 300;
    drawWheel(0);
}

function drawWheel(rotation) {
    const canvas = $('wheel-canvas'); if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 150, cy = 150, r = 130;
    const n = WHEEL_ITEMS.length;
    const arc = (2 * Math.PI) / n;
    const colors = ['#e8647a', '#9b7ccd', '#c9956e', '#6ab0e8', '#f0a0b0', '#c4a8f0', '#e8c4a0', '#b84060', '#7a7090', '#5a3890'];
    ctx.clearRect(0, 0, 300, 300);
    WHEEL_ITEMS.forEach((item, i) => {
        const start = rotation + i * arc;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, start + arc);
        ctx.fillStyle = colors[i % colors.length]; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + arc / 2);
        ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Plus Jakarta Sans';
        ctx.fillText(item.split(' ')[0], r - 8, 4); ctx.restore();
    });
    // center
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fillStyle = '#030209'; ctx.fill();
    ctx.strokeStyle = 'rgba(232,100,122,.5)'; ctx.lineWidth = 2; ctx.stroke();
    // pointer
    ctx.beginPath(); ctx.moveTo(cx + r + 10, cy); ctx.lineTo(cx + r - 10, cy - 10); ctx.lineTo(cx + r - 10, cy + 10);
    ctx.fillStyle = 'var(--rose,#e8647a)'; ctx.fill();
}

function spinWheel() {
    if (wheelSpinning) return;
    wheelSpinning = true;
    $('wheel-btn').disabled = true;
    const total = rnd(4, 8) * Math.PI * 2 + rnd(0, Math.PI * 2);
    let start = null, cur = 0;
    function animate(ts) {
        if (!start) start = ts;
        const progress = (ts - start) / 4000;
        if (progress < 1) {
            const ease = 1 - Math.pow(1 - progress, 4);
            cur = total * ease;
            drawWheel(cur);
            requestAnimationFrame(animate);
        } else {
            cur = total; drawWheel(cur);
            wheelSpinning = false;
            $('wheel-btn').disabled = false;
            const arc = (2 * Math.PI) / WHEEL_ITEMS.length;
            const normalized = (-(cur % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            const idx = Math.floor(normalized / arc) % WHEEL_ITEMS.length;
            const result = WHEEL_ITEMS[idx];
            $('wheel-result').textContent = '🎉 ' + result;
            addWheelHistory(result);
            spawnConfetti(20); unlockAch('wheel');
        }
    }
    requestAnimationFrame(animate);
}

function addWheelHistory(item) {
    const hist = $('wheel-history'); if (!hist) return;
    const el = document.createElement('div'); el.className = 'wheel-hist-item'; el.textContent = item;
    hist.prepend(el); if (hist.children.length > 6) hist.lastChild.remove();
}

/* ---- LOVE PAIRS ---- */
const PAIR_EMOJIS = ['💕', '❤️', '🌸', '✨', '🦋', '🎵', '🌙', '🪐'];
let pairsBoard, pairsFlipped, pairsMatched;

function initPairs() {
    const items = [...PAIR_EMOJIS, ...PAIR_EMOJIS].sort(() => Math.random() - .5);
    pairsFlipped = []; pairsMatched = 0;
    const board = $('love-pairs-board'); board.innerHTML = '';
    pairsBoard = items.map((emoji, i) => {
        const card = document.createElement('div'); card.className = 'love-pair-card';
        card.textContent = '💗'; card.dataset.emoji = emoji; card.dataset.revealed = 'false';
        card.addEventListener('click', () => pairClick(card));
        board.appendChild(card); return card;
    });
    $('love-pairs-status').textContent = 'Encontre os pares! 💕';
    $('love-pairs-score').textContent = '0 / ' + PAIR_EMOJIS.length;
}

function pairClick(card) {
    if (card.dataset.revealed === 'true' || pairsFlipped.length === 2) return;
    card.dataset.revealed = 'true'; card.textContent = card.dataset.emoji;
    card.classList.add('matched');// temp
    pairsFlipped.push(card);
    if (pairsFlipped.length === 2) {
        if (pairsFlipped[0].dataset.emoji === pairsFlipped[1].dataset.emoji) {
            pairsMatched++;
            $('love-pairs-score').textContent = `${pairsMatched} / ${PAIR_EMOJIS.length}`;
            pairsFlipped = [];
            if (pairsMatched === PAIR_EMOJIS.length) {
                $('love-pairs-status').textContent = 'Parabéns! Você encontrou todos os pares! 💕';
                spawnConfetti(40); unlockAch('pairs');
            }
        } else {
            setTimeout(() => {
                pairsFlipped.forEach(c => { c.dataset.revealed = 'false'; c.textContent = '💗'; c.classList.remove('matched'); });
                pairsFlipped = [];
            }, 800);
        }
    }
}

/* ---- LOVE CHALLENGE ---- */
const CHALLENGES = [
    { q: 'O que você mais gosta no Kauê?', opts: ['Sorriso dele', 'Forma como ele te olha', 'Jeito carinhoso', 'Tudo nele 💕'], ans: 3 },
    { q: 'Qual seria o encontro perfeito pra vocês?', opts: ['Cinema e jantar', 'Passeio ao ar livre', 'Ficar em casa juntos', 'Qualquer lugar com você'], ans: 3 },
    { q: 'Se vocês fossem uma música, seria:', opts: ['Saturno', 'Perfect', 'All of Me', 'Nossa própria música'], ans: 3 },
    { q: 'O que mais define esse amor?', opts: ['Parceria', 'Intensidade', 'Cumplicidade', 'Todos os três 💕'], ans: 3 },
    { q: 'Como você descreveria o Kauê?', opts: ['Carinhoso', 'Engraçado', 'Protetor', 'Perfeito do jeito que é 💖'], ans: 3 },
];
let chalIdx = 0, chalScore = 0;

function initChallenge() {
    chalIdx = 0; chalScore = 0; renderChallenge();
}

function renderChallenge() {
    const wrap = $('challenge-wrap'); if (!wrap) return;
    if (chalIdx >= CHALLENGES.length) {
        wrap.innerHTML = `<div class="challenge-score">${chalScore}/${CHALLENGES.length} 💕</div>
      <p style="color:var(--muted);text-align:center;margin-top:.5rem;">Vocês são perfeitos juntos!</p>
      <button onclick="initChallenge()" style="margin:1rem auto;display:block;background:rgba(232,100,122,.15);border:1px solid rgba(232,100,122,.3);color:var(--rose-s);padding:.6rem 1.4rem;border-radius:50px;cursor:pointer;font-size:.8rem;font-weight:600;">Jogar novamente ↺</button>`;
        unlockAch('challenge'); return;
    }
    const c = CHALLENGES[chalIdx];
    wrap.innerHTML = `
    <div class="challenge-q">Desafio ${chalIdx + 1}: ${c.q}</div>
    <div class="challenge-opts">
      ${c.opts.map((o, i) => `<button class="challenge-opt" onclick="chalAnswer(${i})">${o}</button>`).join('')}
    </div>
    <div class="challenge-score">${chalScore} pts</div>
  `;
}

function chalAnswer(idx) {
    const c = CHALLENGES[chalIdx];
    $$('.challenge-opt').forEach(o => o.disabled = true);
    const opts = $$('.challenge-opt');
    opts[idx].classList.add(idx === c.ans ? 'correct' : 'wrong');
    opts[c.ans].classList.add('correct');
    if (idx === c.ans) { chalScore++; spawnConfetti(10); }
    setTimeout(() => { chalIdx++; renderChallenge(); }, 1200);
}

/* ---- SNAKE GAME ---- */
let snakeCanvas, snakeCtx, snakeGame;

function initSnake() {
    snakeCanvas = $('snake-canvas'); if (!snakeCanvas) return;
    snakeCtx = snakeCanvas.getContext('2d');
    const size = Math.min(360, window.innerWidth - 60);
    snakeCanvas.width = size; snakeCanvas.height = size;
    resetSnake();
}

function resetSnake() {
    if (snakeGame) clearInterval(snakeGame.interval);
    const size = snakeCanvas.width; const cell = 20;
    const grid = size / cell;
    snakeGame = {
        snake: [{ x: Math.floor(grid / 2), y: Math.floor(grid / 2) }],
        dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 },
        food: { x: rndInt(0, grid - 1), y: rndInt(0, grid - 1) },
        score: 0, cell, grid, running: false,
        interval: null
    };
    drawSnake();
    $('snake-score-val').textContent = 0;
    $('snake-hi-val').textContent = snakeHi;
    $('snake-msg').textContent = 'Clique no campo para iniciar! 🐍';
}

snakeCanvas && snakeCanvas.addEventListener('click', () => {
    if (!snakeGame.running) { snakeGame.running = true; snakeGame.interval = setInterval(stepSnake, 130); $('snake-msg').textContent = ''; }
});

document.addEventListener('keydown', e => {
    if (!$('gp-10') || !$('gp-10').classList.contains('active')) return;
    const d = snakeGame?.nextDir; if (!d) return;
    if (e.key === 'ArrowUp' && snakeGame.dir.y !== 1) snakeGame.nextDir = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && snakeGame.dir.y !== -1) snakeGame.nextDir = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && snakeGame.dir.x !== 1) snakeGame.nextDir = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && snakeGame.dir.x !== -1) snakeGame.nextDir = { x: 1, y: 0 };
    e.preventDefault();
});

function snakeDir(dx, dy) {
    if (!snakeGame) return;
    if (dx === 1 && snakeGame.dir.x !== -1) snakeGame.nextDir = { x: 1, y: 0 };
    if (dx === -1 && snakeGame.dir.x !== 1) snakeGame.nextDir = { x: -1, y: 0 };
    if (dy === -1 && snakeGame.dir.y !== 1) snakeGame.nextDir = { x: 0, y: -1 };
    if (dy === 1 && snakeGame.dir.y !== -1) snakeGame.nextDir = { x: 0, y: 1 };
}

function stepSnake() {
    const g = snakeGame; if (!g.running) return;
    g.dir = { ...g.nextDir };
    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
    if (head.x < 0 || head.x >= g.grid || head.y < 0 || head.y >= g.grid || g.snake.some(s => s.x === head.x && s.y === head.y)) {
        g.running = false; clearInterval(g.interval);
        $('snake-msg').textContent = `Game over! Score: ${g.score} 💔 Clique para reiniciar`;
        if (g.score > snakeHi) { snakeHi = g.score; localStorage.setItem('kg_snake_hi', snakeHi); $('snake-hi-val').textContent = snakeHi; }
        if (g.score >= 20) unlockAch('snake20');
        snakeCanvas.onclick = () => resetSnake();
        return;
    }
    g.snake.unshift(head);
    if (head.x === g.food.x && head.y === g.food.y) {
        g.score++; $('snake-score-val').textContent = g.score;
        g.food = { x: rndInt(0, g.grid - 1), y: rndInt(0, g.grid - 1) };
    } else g.snake.pop();
    drawSnake();
}

function drawSnake() {
    const g = snakeGame; const ctx = snakeCtx; const c = g.cell;
    ctx.fillStyle = '#030209'; ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,.03)'; ctx.lineWidth = .5;
    for (let i = 0; i < g.grid; i++) {
        ctx.beginPath(); ctx.moveTo(i * c, 0); ctx.lineTo(i * c, snakeCanvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * c); ctx.lineTo(snakeCanvas.width, i * c); ctx.stroke();
    }
    // food
    ctx.font = `${c - 2}px serif`; ctx.fillText('🍎', g.food.x * c, g.food.y * c + c - 2);
    // snake
    g.snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#e8647a' : `hsl(${340 - i * 5},70%,${50 + i * 2}%)`;
        ctx.beginPath(); ctx.roundRect(s.x * c + 1, s.y * c + 1, c - 2, c - 2, 4); ctx.fill();
    });
}

/* ---- TYPING GAME ---- */
const TYPING_PHRASES = [
    'Eu te amo, Gyovanna, do fundo do meu coração.',
    'Cada dia ao seu lado é o melhor da minha vida.',
    'Você é minha constelação favorita.',
    'Nosso amor é de outro mundo, Saturno.',
    'Desde 20 de junho de 2025 tudo faz mais sentido.',
];
let typingPhrase, typingIdx, typingStarted, typingStart, typingTimer2;

function initTyping() {
    typingPhrase = pick(TYPING_PHRASES); typingIdx = 0; typingStarted = false;
    clearInterval(typingTimer2);
    renderTypingText();
    const inp = $('typing-input');
    if (inp) { inp.value = ''; inp.disabled = false; inp.focus(); }
    resetTypingStats();
}

function renderTypingText() {
    const el = $('typing-text'); if (!el) return;
    el.innerHTML = typingPhrase.split('').map((c, i) => `<span class="char${i === 0 ? ' current' : ''}">${c}</span>`).join('');
}

function resetTypingStats() {
    $('typing-wpm') && ($('typing-wpm').textContent = '0');
    $('typing-acc') && ($('typing-acc').textContent = '100%');
    $('typing-time') && ($('typing-time').textContent = '0s');
}

$('typing-input') && $('typing-input').addEventListener('input', e => {
    const val = e.target.value;
    if (!typingStarted && val.length > 0) { typingStarted = true; typingStart = Date.now(); }
    typingIdx = val.length;
    const chars = $$('.char');
    let correct = 0;
    chars.forEach((c, i) => {
        c.classList.remove('correct', 'wrong', 'current');
        if (i < val.length) {
            if (val[i] === typingPhrase[i]) { c.classList.add('correct'); correct++; }
            else c.classList.add('wrong');
        } else if (i === val.length) c.classList.add('current');
    });
    const elapsed = (Date.now() - typingStart) / 1000 || 1;
    const wpm = Math.round((val.length / 5) / (elapsed / 60));
    const acc = val.length ? Math.round(correct / val.length * 100) : 100;
    $('typing-wpm') && ($('typing-wpm').textContent = wpm);
    $('typing-acc') && ($('typing-acc').textContent = acc + '%');
    $('typing-time') && ($('typing-time').textContent = Math.floor(elapsed) + 's');
    if (val === typingPhrase) {
        $('typing-input').disabled = true;
        showToast('⌨️ Frase completa! ' + wpm + ' WPM!');
        spawnConfetti(30);
        if (wpm >= 60) unlockAch('typing60');
        if (wpm > typingBest) { typingBest = wpm; localStorage.setItem('kg_typing_best', wpm); }
        setTimeout(() => initTyping(), 2000);
    }
});

/* ---- INIT GAMES ---- */
function initGames() {
    initWordle();
    initMemory();
    initQuiz();
    initTTT();
    initWheel();
    initPairs();
    initChallenge();
    initStars();
    // snake and typing init on tab switch
}

// lazy init for heavier games
const _baseSwitch = function (idx, btn) {
    const tabs = document.querySelectorAll('.gtab');
    const panels = document.querySelectorAll('.gpanel');
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`gp-${idx}`);
    if (panel) panel.classList.add('active');
    if (idx === 10) initSnake();
    if (idx === 11) initTyping();
};

/* ---- GLOBAL EXPOSE ---- */
window.toggleMsg = toggleMsg;
window.loveMsg = loveMsg;
window.openSecret = openSecret;
window.closeSecret = closeSecret;
window.openCheat = openCheat;
window.closeCheat = closeCheat;
window.cheatUnlockAll = cheatUnlockAll;
window.closeLb = closeLb;
window.lbNav = lbNav;
window.scrollGallery = scrollGallery;
window.openLb = openLb;
window.rollDice = rollDice;
window.clickHeart = clickHeart;
window.resetHearts = resetHearts;
window.resetStars = resetStars;
window.spinWheel = spinWheel;
window.initPairs = initPairs;
window.initChallenge = initChallenge;
window.chalAnswer = chalAnswer;
window.resetWordle = resetWordle;
window.resetMemory = resetMemory;
window.resetQuiz = resetQuiz;
window.quizAnswer = quizAnswer;
window.resetTTT = resetTTT;
window.handleTTT = handleTTT;
window.snakeDir = snakeDir;
window.initTyping = initTyping;
window.switchGame = window.switchGame;
