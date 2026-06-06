/* ============================================================
   KAUÊ & GYOVANNA — index.js  (reescrito do zero)
   ============================================================ */

'use strict';

/* ── CONSTANTES ──────────────────────────────────────────── */
const START = new Date('2025-06-20T20:30:00-03:00');
const CHEAT_CODE = 'KAUEAMAGYOVANNA';

/* ── ESTADO GLOBAL ───────────────────────────────────────── */
let ACH = JSON.parse(localStorage.getItem('kg_ach') || '[]');
let LOVES = +localStorage.getItem('kg_loves') || 0;
let TOT_HRT = +localStorage.getItem('kg_hearts') || 0;
let HI_STARS = +localStorage.getItem('kg_stars_hi') || 0;
let HI_SNAKE = +localStorage.getItem('kg_snake_hi') || 0;
let HI_TYPE = +localStorage.getItem('kg_typing_best') || 0;

/* ── UTILITÁRIOS ─────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const rnd = (a, b) => Math.random() * (b - a) + a;
const rni = (a, b) => Math.floor(rnd(a, b + 1));
const pick = arr => arr[rni(0, arr.length - 1)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ── CONQUISTAS ──────────────────────────────────────────── */
const ACH_DEF = [
    { id: 'visitor', ic: '👀', nm: 'Primeira visita' },
    { id: 'sky', ic: '⭐', nm: 'Explorador estelar' },
    { id: 'gallery', ic: '📸', nm: 'Amante de fotos' },
    { id: 'message', ic: '💌', nm: 'Leu a carta' },
    { id: 'wordle', ic: '🔤', nm: 'Palavra certa' },
    { id: 'memory', ic: '🃏', nm: 'Memória perfeita' },
    { id: 'quiz', ic: '📝', nm: 'Quiz mestre' },
    { id: 'ttt', ic: '❌', nm: 'Velha campeão' },
    { id: 'dice6', ic: '🎲', nm: 'Tiro certeiro' },
    { id: 'love10', ic: '💕', nm: '10 corações' },
    { id: 'love50', ic: '💖', nm: '50 corações' },
    { id: 'stars50', ic: '⭐', nm: '50 estrelas' },
    { id: 'snake20', ic: '🐍', nm: 'Cobra veloz' },
    { id: 'type60', ic: '⌨️', nm: 'Digitador' },
    { id: 'wheel', ic: '🎡', nm: 'Girou a roda' },
    { id: 'pairs', ic: '💑', nm: 'Pares do amor' },
    { id: 'challenge', ic: '💘', nm: 'Desafio aceito' },
    { id: 'konami', ic: '🕹️', nm: 'Konami code' },
    { id: 'secret', ic: '🔮', nm: 'Segredo revelado' },
    { id: 'all', ic: '👑', nm: 'Completou tudo' },
];

function saveAch() { localStorage.setItem('kg_ach', JSON.stringify(ACH)); }

function unlockAch(id) {
    if (ACH.includes(id)) return;
    ACH.push(id); saveAch();
    const card = document.querySelector(`.ach-card[data-id="${id}"]`);
    if (card) { card.classList.add('on'); }
    const def = ACH_DEF.find(a => a.id === id);
    toast(`🏆 ${def ? def.nm : id}`);
    confetti(16);
    updateAchCount();
    if (ACH.length === ACH_DEF.length) unlockAch('all');
}

function unlockAll() {
    ACH_DEF.forEach(a => unlockAch(a.id));
}

function updateAchCount() {
    const el = $('ach-count');
    const sub = $('ach-sub-txt');
    if (el) el.textContent = ACH.length;
    if (sub) sub.textContent = `de ${ACH_DEF.length} conquistas desbloqueadas`;
}

function initAch() {
    const grid = $('ach-grid');
    if (!grid) return;
    grid.innerHTML = ACH_DEF.map(a => `
    <div class="ach-card${ACH.includes(a.id) ? ' on' : ''}" data-id="${a.id}" title="${a.nm}">
      <span class="ach-ic">${a.ic}</span>
      <div class="ach-nm">${a.nm}</div>
    </div>`).join('');
    unlockAch('visitor');
}

/* ── TOAST ───────────────────────────────────────────────── */
function toast(msg) {
    const t = document.createElement('div');
    t.className = 'ach-unlock-toast';
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

/* ── CONFETTI ────────────────────────────────────────────── */
function confetti(n = 24) {
    const cols = ['#e8647a', '#f0a0b0', '#c9956e', '#9b7ccd', '#6ab0e8', '#e8c4a0', '#fff'];
    for (let i = 0; i < n; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'confetti';
            const s = rnd(6, 14);
            el.style.cssText = `left:${rnd(5, 95)}vw;top:-20px;width:${s}px;height:${s}px;` +
                `background:${pick(cols)};--dur:${rnd(1.4, 2.8)}s;--sy:-${rni(40, 120)}px;` +
                `border-radius:${Math.random() > .5 ? '50%' : '3px'};`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3200);
        }, i * 55);
    }
}

/* ── LOADING ─────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { const ld = $('loading'); if (ld) ld.classList.add('done'); }, 2200);
    setup();
});

function setup() {
    initCounter();
    initNav();
    initHeroCanvas();
    initReveal();
    initTicker();
    initGallery();
    initStars();
    initFooterCanvas();
    initGames();
    initAch();
    updateAchCount();
    // restore love count
    const lc = $('msg-love-count');
    if (lc) lc.textContent = LOVES;
    // cheat listener
    let cheatBuf = '';
    document.addEventListener('keydown', e => {
        // konami
        konamiHandler(e);
        // cheat text
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const active = document.activeElement;
            const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
            if (!isInput) {
                cheatBuf = (cheatBuf + e.key.toUpperCase()).slice(-CHEAT_CODE.length);
                if (cheatBuf === CHEAT_CODE) openCheat();
            }
        }
    });
}

/* ── COUNTER ─────────────────────────────────────────────── */
function initCounter() {
    function tick() {
        const now = new Date();
        const s = Math.floor((now - START) / 1000);
        let yr = 0, mo = 0;
        let tmp = new Date(START);
        while (true) { let nx = new Date(tmp); nx.setFullYear(nx.getFullYear() + 1); if (nx > now) break; tmp = nx; yr++; }
        while (true) { let nx = new Date(tmp); nx.setMonth(nx.getMonth() + 1); if (nx > now) break; tmp = nx; mo++; }
        const d = Math.floor((now - tmp) / 86400000);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sc = s % 60;
        setText('c-y', yr);
        setText('c-mo', mo);
        setText('c-d', d);
        setText('c-h', pad(h));
        setText('c-m', pad(m));
        setText('c-s', pad(sc));
        updateRetro(Math.floor(s / 86400), Math.floor(s / 3600), Math.floor(s / 86400) * 47 + 312);
    }
    tick();
    setInterval(tick, 1000);
}

function setText(id, v) { const el = $(id); if (el) el.textContent = v; }
function pad(n) { return String(n).padStart(2, '0'); }

function updateRetro(days, hours, msgs) {
    setText('retro-days', days);
    setText('retro-hours', hours.toLocaleString('pt-BR'));
    setText('retro-msgs', msgs.toLocaleString('pt-BR'));
    setText('retro-update-time', 'Atualizado agora ✨');
}

/* ── NAV ─────────────────────────────────────────────────── */
function initNav() {
    const nav = $('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    });
    // active section highlight
    const secs = ['hero', 'story', 'instagram', 'music', 'sky', 'games', 'gallery', 'achievements', 'retro'];
    const obs = new IntersectionObserver(en => {
        en.forEach(e => {
            if (e.isIntersecting) {
                $$('.nav-links a').forEach(a => {
                    a.classList.toggle('active-link', a.getAttribute('href') === '#' + e.target.id);
                });
            }
        });
    }, { threshold: .3 });
    secs.forEach(id => { const el = $(id); if (el) obs.observe(el); });
    // mobile close
    $$('.nav-mobile a').forEach(a => a.addEventListener('click', () => {
        const nm = $('nav-mobile'); if (nm) nm.classList.remove('open');
    }));
}

/* ── HERO CANVAS ─────────────────────────────────────────── */
function initHeroCanvas() {
    const cv = $('hero-canvas'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const pts = [];
    const floats = [];

    function resize() { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 90; i++) pts.push({
        x: rnd(0, 1), y: rnd(0, 1),
        vx: (rnd(0, 1) - .5) * .3, vy: (rnd(0, 1) - .5) * .3,
        r: rnd(.4, 2), al: rnd(.2, .9),
        col: pick(['#e8647a', '#f0a0b0', '#c4a8f0', '#6ab0e8', '#fffacd'])
    });

    setInterval(() => {
        if (floats.length < 14) floats.push({
            x: rnd(.05, .95), y: 1.05, vy: rnd(.003, .007),
            sz: rni(14, 26), al: 1, sym: pick(['♡', '❤', '💕', '✨', '★'])
        });
    }, 900);

    function draw() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        // particles
        pts.forEach(p => {
            p.x += p.vx / cv.width; p.y += p.vy / cv.height;
            if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
            if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
            ctx.save(); ctx.globalAlpha = p.al * .55;
            ctx.beginPath(); ctx.arc(p.x * cv.width, p.y * cv.height, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.col; ctx.fill(); ctx.restore();
        });
        // floating hearts
        for (let i = floats.length - 1; i >= 0; i--) {
            const h = floats[i];
            h.y -= h.vy; h.al -= .002;
            if (h.al <= 0) { floats.splice(i, 1); continue; }
            ctx.save(); ctx.globalAlpha = h.al * .45;
            ctx.font = `${h.sz}px serif`;
            ctx.fillStyle = '#e8647a';
            ctx.fillText(h.sym, h.x * cv.width, h.y * cv.height);
            ctx.restore();
        }
        requestAnimationFrame(draw);
    }
    draw();

    // click burst
    cv.addEventListener('click', e => {
        const r = cv.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const el = document.createElement('div');
            el.className = 'floating-heart';
            el.textContent = pick(['💕', '❤️', '✨', '💖', '🌸', '⭐']);
            el.style.cssText = `position:absolute;left:${e.clientX - r.left + rnd(-40, 40)}px;` +
                `top:${e.clientY - r.top - 10}px;font-size:${rni(14, 22)}px;pointer-events:none;` +
                `animation:rise ${rnd(1.5, 2.5)}s ease-in forwards;`;
            cv.parentElement.appendChild(el);
            setTimeout(() => el.remove(), 2600);
        }
    });
}

/* ── FOOTER CANVAS ───────────────────────────────────────── */
function initFooterCanvas() {
    const cv = $('footer-canvas'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const pts = [];
    function resize() { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 50; i++) pts.push({ x: rnd(0, 1), y: rnd(0, 1), r: rnd(.3, 1.8), a: rnd(.1, .5) });
    function draw() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        pts.forEach(p => {
            ctx.save(); ctx.globalAlpha = p.a * .35;
            ctx.beginPath(); ctx.arc(p.x * cv.width, p.y * cv.height, p.r, 0, Math.PI * 2);
            ctx.fillStyle = '#e8647a'; ctx.fill(); ctx.restore();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

/* ── REVEAL ──────────────────────────────────────────────── */
function initReveal() {
    const obs = new IntersectionObserver(en => {
        en.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .1 });
    $$('.reveal').forEach(el => obs.observe(el));
}

/* ── TICKER ──────────────────────────────────────────────── */
const QUOTES = [
    { t: 'Você é meu lar preferido', i: '🏠' },
    { t: 'Escorpião nos assistiu se apaixonar', i: '🦂' },
    { t: 'G + K — Saturno', i: '🪐' },
    { t: '20 de junho de 2025', i: '📅' },
    { t: 'Anápolis, Goiás', i: '📍' },
    { t: 'Eu te amo, Gyovanna', i: '❤️' },
    { t: 'Cada segundo com você é presente', i: '🎁' },
    { t: 'O universo conspirou pra nos juntar', i: '✨' },
    { t: 'Antares brilhou por nós', i: '⭐' },
    { t: 'Para sempre aqui', i: '♾️' },
    { t: 'Você é a melhor parte do meu dia', i: '🌅' },
    { t: 'Te amo de um jeito que não cabe em texto', i: '💕' },
];

function initTicker() {
    const el = $('quotes-inner'); if (!el) return;
    const list = [...QUOTES, ...QUOTES];
    el.innerHTML = list.map(q =>
        `<span class="quote-item"><span class="q-icon">${q.i}</span>${q.t}</span>`
    ).join('');
}

/* ── GALLERY ─────────────────────────────────────────────── */
let lbIndex = 0, galleryImgs = [];

function initGallery() {
    const scroll = $('gallery-scroll'); if (!scroll) return;
    let isDown = false, startX = 0, sl = 0;
    scroll.addEventListener('mousedown', e => { isDown = true; scroll.classList.add('dragging'); startX = e.pageX - scroll.offsetLeft; sl = scroll.scrollLeft; });
    window.addEventListener('mouseup', () => { isDown = false; scroll.classList.remove('dragging'); });
    scroll.addEventListener('mousemove', e => {
        if (!isDown) return; e.preventDefault();
        scroll.scrollLeft = sl - (e.pageX - scroll.offsetLeft - startX) * 1.2;
    });
    galleryImgs = $$('.g-card img').map(i => i.src);
    buildDots();
    scroll.addEventListener('scroll', syncDots);
}

function buildDots() {
    const wrap = $('g-dots'); if (!wrap) return;
    wrap.innerHTML = galleryImgs.map((_, i) =>
        `<button class="g-dot${i === 0 ? ' active' : ''}" onclick="scrollGallery(${i})"></button>`
    ).join('');
}

function syncDots() {
    const scroll = $('gallery-scroll'); if (!scroll) return;
    const i = Math.round(scroll.scrollLeft / (scroll.offsetWidth || 1));
    $$('.g-dot').forEach((d, j) => d.classList.toggle('active', i === j));
}

function scrollGallery(i) {
    const scroll = $('gallery-scroll'); if (!scroll) return;
    const cards = $$('.g-card');
    if (cards[i]) cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}

function openLb(src, idx) {
    lbIndex = idx || 0;
    const lb = $('lightbox'); lb.classList.add('open');
    $('lb-img').src = src;
    unlockAch('gallery');
}

function closeLb() { $('lightbox').classList.remove('open'); }

function lbNav(dir) {
    if (!galleryImgs.length) return;
    lbIndex = (lbIndex + dir + galleryImgs.length) % galleryImgs.length;
    $('lb-img').src = galleryImgs[lbIndex];
}

document.addEventListener('keydown', e => {
    const lb = $('lightbox');
    if (lb && lb.classList.contains('open')) {
        if (e.key === 'ArrowRight') lbNav(1);
        if (e.key === 'ArrowLeft') lbNav(-1);
        if (e.key === 'Escape') closeLb();
    }
});

/* ── SKY STARS ───────────────────────────────────────────── */
function initStars() {
    const svg = $('sky-svg'); const tip = $('star-tooltip'); if (!svg || !tip) return;
    $$('.sky-star').forEach(g => {
        g.addEventListener('mouseenter', () => {
            tip.innerHTML = `<strong>${g.dataset.name || ''}</strong>${g.dataset.info || ''}` +
                `<div class="mag">Magnitude: ${g.dataset.mag || '?'}</div>`;
            tip.classList.add('show');
            unlockAch('sky');
        });
        g.addEventListener('mousemove', e => {
            const rc = svg.closest('.sky-svg-container').getBoundingClientRect();
            tip.style.left = (e.clientX - rc.left + 14) + 'px';
            tip.style.top = (e.clientY - rc.top - 14) + 'px';
        });
        g.addEventListener('mouseleave', () => tip.classList.remove('show'));
        g.addEventListener('click', () => { g.classList.toggle('active'); confetti(8); });
    });
}

/* ── MENSAGEM ────────────────────────────────────────────── */
function toggleMsg() {
    const full = $('msg-full'), btn = $('msg-btn');
    const open = full.classList.toggle('open');
    btn.innerHTML = open ? '💌 Esconder mensagem' : '💌 Mostrar mensagem completa';
    if (open) { unlockAch('message'); confetti(12); }
}

function loveMsg() {
    LOVES++; localStorage.setItem('kg_loves', LOVES);
    setText('msg-love-count', LOVES);
    const btn = $('msg-love-btn');
    if (btn) { btn.classList.add('loved'); setTimeout(() => btn.classList.remove('loved'), 500); }
    floatHeart();
    if (LOVES >= 10) unlockAch('love10');
    if (LOVES >= 50) unlockAch('love50');
}

function floatHeart() {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = pick(['💕', '❤️', '💖', '🌸', '✨']);
    h.style.cssText = `position:fixed;left:${rnd(20, 80)}vw;bottom:${rnd(15, 35)}vh;` +
        `z-index:3000;font-size:${rni(16, 28)}px;pointer-events:none;animation:rise 2.2s ease-in forwards;`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2400);
}

/* ── SECRET / CHEAT ──────────────────────────────────────── */
const SECRET = {
    konami: {
        title: '🕹️ Código Secreto!',
        msg: 'Você descobriu o Konami Code! Aqui vai uma verdade: cada vez que você sorri, eu fico sem fôlego. Te amo demais, Gyovanna. 💕'
    },
    cheat: {
        title: '✨ Cheat Ativado!',
        msg: 'Todas as conquistas desbloqueadas! Mas a maior conquista foi você entrar na minha vida. 👑'
    },
};

function openSecret(type) {
    const d = SECRET[type] || SECRET.konami;
    setText('secret-title', d.title);
    setText('secret-msg', d.msg);
    const o = $('secret-overlay'); o.classList.add('show');
    const hc = $('secret-hearts'); hc.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const h = document.createElement('div');
        h.className = 'secret-heart';
        h.textContent = pick(['❤️', '💕', '💖', '✨', '🌸']);
        h.style.cssText = `left:${rnd(2, 94)}%;bottom:0;animation-delay:${rnd(0, 2.5)}s;`;
        hc.appendChild(h);
    }
    unlockAch('secret');
    confetti(35);
}
function closeSecret() { $('secret-overlay').classList.remove('show'); }

function openCheat() { $('cheat-overlay').classList.add('show'); unlockAch('secret'); }
function closeCheat() { $('cheat-overlay').classList.remove('show'); }
function cheatUnlockAll() { unlockAll(); confetti(70); toast('👑 Todas as conquistas desbloqueadas!'); closeCheat(); openSecret('cheat'); }

/* ── KONAMI ──────────────────────────────────────────────── */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kpos = 0;
function konamiHandler(e) {
    if (e.key === KONAMI[kpos]) { kpos++; if (kpos === KONAMI.length) { kpos = 0; unlockAch('konami'); openSecret('konami'); } }
    else kpos = 0;
}

/* ================================================================
   JOGOS
   ================================================================ */

function switchGame(idx, btn) {
    $$('.gtab').forEach(t => t.classList.remove('active'));
    $$('.gpanel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = $(`gp-${idx}`);
    if (panel) panel.classList.add('active');
    // lazy init
    if (idx === 10 && !snakeReady) initSnake();
    if (idx === 11 && !typingReady) initTyping();
}

function initGames() {
    initWordle();
    initMemory();
    initQuiz();
    initTTT();
    initDice();
    initHearts();
    initStarsGame();
    initWheel();
    initPairs();
    initChallenge();
}

/* ── 1. WORDLE ───────────────────────────────────────────── */
// A primeira palavra sempre será TUDO
const W_WORDS = ['TUDO', 'AMOR', 'ALMA', 'ROSA', 'FLOR', 'LUAR', 'DOCE', 'PURA', 'BELO', 'VIDA'];
let wWord = 'TUDO', wRow = 0, wCol = 0, wDone = false, wGuesses = [], wMap = {};

function initWordle() {
    wWord = 'TUDO'; // sempre começa com TUDO
    wRow = 0; wCol = 0; wDone = false;
    wGuesses = Array.from({ length: 6 }, () => Array(4).fill(''));
    wMap = {};
    const board = $('w-board'); if (!board) return;
    board.innerHTML = '';
    for (let r = 0; r < 6; r++) {
        const row = document.createElement('div'); row.className = 'w-row';
        for (let c = 0; c < 4; c++) {
            const tile = document.createElement('div'); tile.className = 'w-tile';
            tile.id = `wt-${r}-${c}`; row.appendChild(tile);
        }
        board.appendChild(row);
    }
    setText('w-status', '');
    const win = $('w-win'), lose = $('w-lose'), again = $('w-again');
    if (win) win.style.display = 'none';
    if (lose) lose.style.display = 'none';
    if (again) again.style.display = 'none';
    buildWKeyboard();
    // remove old listeners by cloning
    const oldKb = $('w-kb');
    if (oldKb) {
        const fresh = oldKb.cloneNode(true);
        oldKb.parentNode.replaceChild(fresh, oldKb);
    }
    buildWKeyboard();
}

function buildWKeyboard() {
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];
    const kb = $('w-kb'); if (!kb) return;
    kb.innerHTML = '';
    rows.forEach(row => {
        const div = document.createElement('div'); div.className = 'w-kb-row';
        row.forEach(k => {
            const btn = document.createElement('button');
            btn.className = 'w-key' + (k.length > 1 ? ' wide' : '');
            btn.textContent = k; btn.dataset.key = k;
            if (k === 'ENTER') btn.classList.add('enter-key');
            btn.addEventListener('click', () => wKey(k));
            div.appendChild(btn);
        });
        kb.appendChild(div);
    });
}

// physical keyboard for wordle
document.addEventListener('keydown', e => {
    const panel = $('gp-0'); if (!panel || !panel.classList.contains('active')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Enter') wKey('ENTER');
    else if (e.key === 'Backspace') wKey('⌫');
    else if (/^[a-zA-Z]$/.test(e.key)) wKey(e.key.toUpperCase());
});

function wKey(k) {
    if (wDone) return;
    if (k === '⌫') {
        if (wCol > 0) { wCol--; wGuesses[wRow][wCol] = ''; wTile(wRow, wCol).textContent = ''; wTile(wRow, wCol).classList.remove('filled'); }
    } else if (k === 'ENTER') {
        if (wCol < 4) { wShake(); return; }
        wSubmit();
    } else if (wCol < 4) {
        wGuesses[wRow][wCol] = k;
        const t = wTile(wRow, wCol);
        t.textContent = k; t.classList.add('filled', 'bounce-in');
        setTimeout(() => t.classList.remove('bounce-in'), 300);
        wCol++;
    }
}

function wTile(r, c) { return document.getElementById(`wt-${r}-${c}`); }

function wShake() {
    for (let c = 0; c < 4; c++) {
        const t = wTile(wRow, c); t.classList.add('shake');
        setTimeout(() => t.classList.remove('shake'), 500);
    }
    setText('w-status', 'Palavra incompleta!');
}

function wSubmit() {
    const guess = wGuesses[wRow].join('');
    const target = wWord;
    const res = Array(4).fill('absent');
    const used = Array(4).fill(false);
    for (let i = 0; i < 4; i++) if (guess[i] === target[i]) { res[i] = 'correct'; used[i] = true; }
    for (let i = 0; i < 4; i++) {
        if (res[i] === 'correct') continue;
        for (let j = 0; j < 4; j++) {
            if (!used[j] && res[j] !== 'correct' && guess[i] === target[j]) { res[i] = 'present'; used[j] = true; break; }
        }
    }
    const DELAY = 120;
    res.forEach((r, c) => {
        setTimeout(() => {
            const t = wTile(wRow, c);
            t.classList.remove('filled');
            t.classList.add(`flip-${r}`);
            wUpdateKey(guess[c], r);
        }, c * DELAY);
    });
    const won = res.every(r => r === 'correct');
    setTimeout(() => {
        if (won) {
            const win = $('w-win'); if (win) win.style.display = 'block';
            const again = $('w-again'); if (again) again.style.display = 'block';
            wDone = true; confetti(40); unlockAch('wordle');
            setText('w-status', 'Você acertou! 💕');
        } else if (wRow === 5) {
            const lose = $('w-lose'); if (lose) {
                lose.style.display = 'block';
                const p = lose.querySelector('p');
                if (p) p.innerHTML = `A palavra era: <strong>${wWord}</strong><br>Mas eu amo tudo em você, Gyovanna! 💕`;
            }
            const again = $('w-again'); if (again) again.style.display = 'block';
            wDone = true;
        } else { wRow++; wCol = 0; setText('w-status', ''); }
    }, 4 * DELAY + 350);
}

function wUpdateKey(letter, status) {
    const priority = { correct: 3, present: 2, absent: 1 };
    const btn = document.querySelector(`.w-key[data-key="${letter}"]`);
    if (!btn) return;
    const cur = priority[wMap[letter]] || 0;
    if ((priority[status] || 0) > cur) {
        btn.className = 'w-key' + (letter.length > 1 ? ' wide' : '');
        btn.classList.add(status);
        wMap[letter] = status;
    }
}

function resetWordle() {
    // choose random after first
    wWord = pick(W_WORDS);
    initWordle();
}

/* ── 2. MEMÓRIA ──────────────────────────────────────────── */
const MEM_EM = ['💕', '❤️', '🌸', '✨', '🦋', '🎵', '🌙', '🪐'];
let memFlipped = [], memMatched = 0, memMoves = 0, memSecs = 0, memTimer = null;

function initMemory() {
    clearInterval(memTimer);
    memFlipped = []; memMatched = 0; memMoves = 0; memSecs = 0;
    setText('mem-moves', '0'); setText('mem-time', '0:00'); setText('mem-pairs', '0/8');
    const win = $('mem-win'); if (win) win.style.display = 'none';
    const board = $('mem-board'); if (!board) return;
    const pairs = [...MEM_EM, ...MEM_EM].sort(() => Math.random() - .5);
    board.innerHTML = '';
    pairs.forEach((em, i) => {
        const card = document.createElement('div'); card.className = 'mem-card';
        card.innerHTML = `<div class="mem-face mem-back"></div><div class="mem-face mem-front">${em}</div>`;
        card.dataset.em = em;
        card.addEventListener('click', () => memClick(card));
        board.appendChild(card);
    });
    memTimer = setInterval(() => {
        memSecs++;
        const m = Math.floor(memSecs / 60), s = memSecs % 60;
        setText('mem-time', `${m}:${pad(s)}`);
    }, 1000);
}

function memClick(card) {
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (memFlipped.length === 2) return;
    card.classList.add('flipped');
    memFlipped.push(card);
    if (memFlipped.length === 2) {
        memMoves++; setText('mem-moves', memMoves);
        if (memFlipped[0].dataset.em === memFlipped[1].dataset.em) {
            memFlipped.forEach(c => c.classList.add('matched', 'flipped'));
            memMatched++; setText('mem-pairs', `${memMatched}/8`);
            memFlipped = [];
            if (memMatched === 8) {
                clearInterval(memTimer);
                const win = $('mem-win'); if (win) {
                    win.style.display = 'block';
                    const p = win.querySelector('p');
                    if (p) p.textContent = `${memMoves} jogadas · ${$('mem-time').textContent} — Incrível! 💕`;
                }
                confetti(50); unlockAch('memory');
            }
        } else {
            setTimeout(() => { memFlipped.forEach(c => c.classList.remove('flipped')); memFlipped = []; }, 900);
        }
    }
}

function resetMemory() { initMemory(); }

/* ── 3. QUIZ ─────────────────────────────────────────────── */
const QUIZ = [
    {
        q: 'Quando Kauê e Gyovanna começaram a namorar?',
        o: ['20 de junho de 2025', '14 de fevereiro de 2025', '01 de janeiro de 2025', '20 de março de 2025'], a: 0
    },
    {
        q: 'Qual é a música favorita do casal?',
        o: ['G + K — Saturno', 'Perfect — Ed Sheeran', 'All of Me — John Legend', 'Lover — Taylor Swift'], a: 0
    },
    {
        q: 'Em qual cidade ficamos juntos?',
        o: ['Goiânia', 'Brasília', 'Anápolis', 'São Paulo'], a: 2
    },
    {
        q: 'Qual constelação nos assistiu se apaixonar?',
        o: ['Orion', 'Escorpião', 'Cruzeiro do Sul', 'Gêmeos'], a: 1
    },
    {
        q: 'O que Kauê mais ama em Gyovanna?',
        o: ['O sorriso dela', 'Os olhos dela', 'O jeito que ela ri', 'Tudo nela'], a: 3
    },
    {
        q: 'Qual estrela é o coração de Escorpião?',
        o: ['Sirius', 'Antares', 'Acrux', 'Betelgeuse'], a: 1
    },
    {
        q: 'Em qual estado do Brasil ficamos?',
        o: ['Goiás', 'Minas Gerais', 'São Paulo', 'Bahia'], a: 0
    },
];
let qIdx = 0, qScore = 0;

function initQuiz() {
    qIdx = 0; qScore = 0;
    const r = $('quiz-result'); if (r) r.style.display = 'none';
    renderQ();
}

function renderQ() {
    const el = $('q-prog'); if (el) el.style.width = `${(qIdx / QUIZ.length) * 100}%`;
    const content = $('quiz-content');
    if (!content) return;
    if (qIdx >= QUIZ.length) {
        content.style.display = 'none';
        const r = $('quiz-result'); if (r) r.style.display = 'block';
        setText('q-score', qScore);
        setText('q-of', `de ${QUIZ.length} acertos`);
        setText('q-msg',
            qScore === QUIZ.length ? 'Perfeito! Você nos conhece de cor! 💕' :
                qScore >= 5 ? 'Muito bem! Quase perfeito! ❤️' :
                    qScore >= 3 ? 'Bom esforço! Tente novamente! 🌸' :
                        'Continue tentando! A gente acredita em você! ✨');
        unlockAch('quiz');
        if (qScore === QUIZ.length) confetti(60);
        return;
    }
    content.style.display = 'block';
    const q = QUIZ[qIdx];
    const letters = ['A', 'B', 'C', 'D'];
    content.innerHTML = `
    <div class="quiz-q-num">Pergunta ${qIdx + 1} de ${QUIZ.length}</div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-opts">
      ${q.o.map((o, i) => `
        <button class="quiz-opt" onclick="quizAnswer(${i})">
          <span class="quiz-opt-letter">${letters[i]}</span>${o}
        </button>`).join('')}
    </div>`;
}

function quizAnswer(idx) {
    const q = QUIZ[qIdx];
    $$('.quiz-opt').forEach(o => o.disabled = true);
    $$('.quiz-opt')[idx].classList.add(idx === q.a ? 'correct' : 'wrong');
    if (idx !== q.a) $$('.quiz-opt')[q.a].classList.add('correct');
    if (idx === q.a) { qScore++; confetti(10); }
    setTimeout(() => { qIdx++; renderQ(); }, 1300);
}

function resetQuiz() { initQuiz(); }

/* ── 4. VELHA (minimax) ──────────────────────────────────── */
let tttB, tttDone, tttSX = 0, tttSO = 0, tttSD = 0;
const WINS3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function initTTT() {
    tttB = Array(9).fill(''); tttDone = false;
    $$('.ttt-cell').forEach((c, i) => { c.textContent = ''; c.className = 'ttt-cell'; c.onclick = () => tttClick(i); });
    setText('tictactoe-status', 'Seu turno! 💕');
    updateTTTScore();
}

function updateTTTScore() {
    const el = $('ttt-score');
    if (el) el.innerHTML = `Você: <span>${tttSX}</span> · IA: <span>${tttSO}</span> · Empates: <span>${tttSD}</span>`;
}

function tttClick(i) {
    if (tttDone || tttB[i]) return;
    tttB[i] = 'X';
    const cell = $$('.ttt-cell')[i]; cell.textContent = 'X'; cell.classList.add('x-cell');
    const w = tttWin('X'); if (w) { tttEnd('X', w); return; }
    if (tttFull()) { tttEnd('draw'); return; }
    setText('tictactoe-status', 'IA pensando... 🤔');
    setTimeout(tttAI, 500);
}

function tttAI() {
    const best = minimax([...tttB], 'O');
    if (best.idx == null) return;
    tttB[best.idx] = 'O';
    const cell = $$('.ttt-cell')[best.idx]; cell.textContent = 'O'; cell.classList.add('o-cell');
    const w = tttWin('O'); if (w) { tttEnd('O', w); return; }
    if (tttFull()) { tttEnd('draw'); return; }
    setText('tictactoe-status', 'Seu turno! 💕');
}

function minimax(b, p) {
    if (tttWin('O', b)) return { score: 10 };
    if (tttWin('X', b)) return { score: -10 };
    if (b.every(c => c)) return { score: 0 };
    const op = p === 'O' ? 'X' : 'O';
    const moves = [];
    b.forEach((_, i) => {
        if (b[i]) return;
        const nb = [...b]; nb[i] = p;
        moves.push({ idx: i, score: minimax(nb, op).score });
    });
    return p === 'O'
        ? moves.reduce((a, c) => c.score > a.score ? c : a)
        : moves.reduce((a, c) => c.score < a.score ? c : a);
}

function tttWin(p, b = tttB) {
    return WINS3.find(combo => combo.every(i => b[i] === p)) || null;
}
function tttFull(b = tttB) { return b.every(c => c); }

function tttEnd(w, combo) {
    tttDone = true;
    if (w === 'draw') {
        setText('tictactoe-status', 'Empate! 🤝'); tttSD++;
    } else {
        combo.forEach(i => $$('.ttt-cell')[i].classList.add('win-cell'));
        if (w === 'X') { setText('tictactoe-status', 'Você ganhou! 🎉'); tttSX++; confetti(24); unlockAch('ttt'); }
        else { setText('tictactoe-status', 'IA ganhou! 🤖 Tente de novo!'); tttSO++; }
    }
    updateTTTScore();
    setTimeout(resetTTT, 2800);
}

function resetTTT() { initTTT(); }

function handleTTT(i) { tttClick(i); }

/* ── 5. DADO ─────────────────────────────────────────────── */
const D_FACE = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const D_MSG = ['Baixinho 😅', 'Quase lá...', 'Razoável 😊', 'Bom resultado! 👍', 'Muito bom! 🌟', 'MÁXIMO! 🎉🎊'];
let dTotal = 0, dBest = 0;

function initDice() { }

function rollDice() {
    const dice = $('dice'); if (!dice) return;
    dice.classList.add('rolling');
    setTimeout(() => {
        dice.classList.remove('rolling');
        const v = rni(1, 6);
        dice.textContent = D_FACE[v - 1];
        dTotal += v; if (v > dBest) dBest = v;
        setText('dice-last', v);
        setText('dice-best', dBest);
        setText('dice-total', dTotal);
        setText('dice-result', D_MSG[v - 1]);
        if (v === 6) { confetti(24); unlockAch('dice6'); }
    }, 650);
}

/* ── 6. CORAÇÕES ─────────────────────────────────────────── */
const H_LVL = ['Aquecendo...', 'Carinhoso 🥰', 'Apaixonado 😍', 'Intenso 🔥', 'AMOR TOTAL 💕💕'];
let hCount = 0, hCombo = 0, hTimer = null, hLevel = 0;

function initHearts() { }

function clickHeart() {
    hCount++; hCombo++;
    TOT_HRT++; localStorage.setItem('kg_hearts', TOT_HRT);
    clearTimeout(hTimer);
    hTimer = setTimeout(() => hCombo = 0, 1500);
    hLevel = clamp(Math.floor(hCombo / 5), 0, 4);
    setText('hearts-display', hCount);
    setText('combo-count', hCombo);
    const lvl = $('hearts-level'); if (lvl) lvl.textContent = H_LVL[hLevel];
    floatHeart();
    if (hCombo === 10) toast('🔥 Combo x10!');
    if (hCombo === 25) toast('💥 Combo INCRÍVEL x25!');
    if (TOT_HRT >= 10) unlockAch('love10');
    if (TOT_HRT >= 50) unlockAch('love50');
}

function resetHearts() { hCount = 0; hCombo = 0; setText('hearts-display', 0); setText('combo-count', 0); }

/* ── 7. ESTRELAS ─────────────────────────────────────────── */
let stScore = 0, stTime = 30, stInter = null, stSpawn = null;

function initStarsGame() {
    clearInterval(stInter); clearInterval(stSpawn);
    stScore = 0; stTime = 30;
    setText('stars-score', 0); setText('stars-time', 30);
    const hi = $('stars-hi'); if (hi) hi.textContent = HI_STARS;
    const field = $('stars-field'); if (!field) return;
    field.innerHTML = '';
    stInter = setInterval(() => {
        stTime--; setText('stars-time', stTime);
        if (stTime <= 0) {
            clearInterval(stInter); clearInterval(stSpawn);
            if (field) field.innerHTML = `<p style="color:var(--muted);padding:2rem;font-size:1rem">⏱ Tempo! Score: ${stScore} ⭐</p>`;
            if (stScore > HI_STARS) { HI_STARS = stScore; localStorage.setItem('kg_stars_hi', HI_STARS); const hi = $('stars-hi'); if (hi) hi.textContent = HI_STARS; }
            if (stScore >= 50) unlockAch('stars50');
        }
    }, 1000);
    stSpawn = setInterval(spawnStar, 650);
}

function spawnStar() {
    const field = $('stars-field'); if (!field) return;
    if (field.querySelectorAll('.star-item').length > 12) return;
    const star = document.createElement('div'); star.className = 'star-item';
    star.textContent = pick(['⭐', '🌟', '💫', '✨', '🌠']);
    star.style.cssText = `left:${rnd(5, 85)}%;top:${rnd(5, 80)}%;animation-delay:${rnd(0, .8)}s;`;
    star.addEventListener('click', () => {
        stScore++; setText('stars-score', stScore);
        sparkle(star); star.remove();
    });
    field.appendChild(star);
    setTimeout(() => { if (star.parentNode) star.remove(); }, 2800);
}

function sparkle(el) {
    const rc = el.getBoundingClientRect();
    const cols = ['#e8647a', '#f0a0b0', '#c4a8f0', '#e8c4a0', '#fff'];
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        const tx = rnd(-45, 45), ty = rnd(-70, -20);
        p.style.cssText = `position:fixed;left:${rc.left + rc.width / 2}px;top:${rc.top}px;` +
            `width:6px;height:6px;border-radius:50%;background:${pick(cols)};` +
            `pointer-events:none;z-index:3001;` +
            `animation:particle-fly .65s ease forwards;--tx:${tx}px;--ty:${ty}px;`;
        document.body.appendChild(p); setTimeout(() => p.remove(), 750);
    }
}

function resetStars() { initStarsGame(); }

/* ── 8. RODA DA FORTUNA ──────────────────────────────────── */
const WHEEL_OPTS = [
    'Beijo 💋', 'Abraço 🤗', 'Eu te amo ❤️', 'Surpreenda-me ✨',
    'Música juntos 🎵', 'Dança comigo 💃', 'Cozinhar juntos 🍳',
    'Passeio 🌅', 'Mensagem fofa 💌', 'Contar histórias 📖'
];
let wSpin = false, wAngle = 0;

function initWheel() {
    const cv = $('wheel-canvas'); if (!cv) return;
    cv.width = 300; cv.height = 300;
    drawWheel(0);
}

function drawWheel(rot) {
    const cv = $('wheel-canvas'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const cx = 150, cy = 150, r = 128;
    const arc = (2 * Math.PI) / WHEEL_OPTS.length;
    const cols = ['#e8647a', '#9b7ccd', '#c9956e', '#6ab0e8', '#f0a0b0', '#c4a8f0', '#e8c4a0', '#b84060', '#7a7090', '#5a3890'];
    ctx.clearRect(0, 0, 300, 300);
    WHEEL_OPTS.forEach((item, i) => {
        const s = rot + i * arc;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, s, s + arc);
        ctx.fillStyle = cols[i % cols.length]; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(s + arc / 2);
        ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Plus Jakarta Sans';
        ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 3;
        ctx.fillText(item.split(' ')[0], r - 8, 4);
        ctx.restore();
    });
    // center circle
    ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fillStyle = '#030209'; ctx.fill();
    ctx.strokeStyle = 'rgba(232,100,122,.6)'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = '#e8647a'; ctx.font = 'bold 12px Plus Jakarta Sans'; ctx.textAlign = 'center';
    ctx.fillText('K&G', cx, cy + 4);
    // pointer triangle on right
    ctx.beginPath(); ctx.moveTo(cx + r + 14, cy); ctx.lineTo(cx + r - 2, cy - 10); ctx.lineTo(cx + r - 2, cy + 10);
    ctx.fillStyle = '#e8647a'; ctx.fill();
}

function spinWheel() {
    if (wSpin) return;
    wSpin = true;
    const btn = $('wheel-btn'); if (btn) btn.disabled = true;
    const extra = rnd(4, 8) * Math.PI * 2 + rnd(0, Math.PI * 2);
    const total = wAngle + extra;
    let start = null;
    function frame(ts) {
        if (!start) start = ts;
        const pct = (ts - start) / 4200;
        if (pct < 1) {
            const ease = 1 - Math.pow(1 - pct, 4);
            const cur = wAngle + extra * ease;
            drawWheel(cur);
            requestAnimationFrame(frame);
        } else {
            wAngle = total % (Math.PI * 2);
            drawWheel(wAngle);
            wSpin = false;
            if (btn) btn.disabled = false;
            const arc = (2 * Math.PI) / WHEEL_OPTS.length;
            const norm = (-(wAngle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2);
            const idx = Math.floor(norm / arc) % WHEEL_OPTS.length;
            const result = WHEEL_OPTS[idx];
            setText('wheel-result', '🎉 ' + result);
            addWheelHist(result);
            confetti(20); unlockAch('wheel');
        }
    }
    requestAnimationFrame(frame);
}

function addWheelHist(item) {
    const h = $('wheel-history'); if (!h) return;
    const el = document.createElement('div'); el.className = 'wheel-hist-item'; el.textContent = item;
    h.prepend(el); while (h.children.length > 6) h.lastChild.remove();
}

/* ── 9. PARES ────────────────────────────────────────────── */
const PAIR_EM = ['💕', '❤️', '🌸', '✨', '🦋', '🎵', '🌙', '🪐'];
let pFlipped = [], pMatched = 0;

function initPairs() {
    pFlipped = []; pMatched = 0;
    const board = $('love-pairs-board'); if (!board) return;
    board.innerHTML = '';
    const items = [...PAIR_EM, ...PAIR_EM].sort(() => Math.random() - .5);
    items.forEach(em => {
        const card = document.createElement('div'); card.className = 'love-pair-card';
        card.textContent = '💗'; card.dataset.em = em; card.dataset.open = '0';
        card.addEventListener('click', () => pairClick(card));
        board.appendChild(card);
    });
    setText('love-pairs-status', 'Encontre os pares! 💕');
    setText('love-pairs-score', `0 / ${PAIR_EM.length}`);
}

function pairClick(card) {
    if (card.dataset.open === '1' || card.classList.contains('matched') || pFlipped.length === 2) return;
    card.dataset.open = '1'; card.textContent = card.dataset.em; card.classList.add('matched');
    pFlipped.push(card);
    if (pFlipped.length === 2) {
        if (pFlipped[0].dataset.em === pFlipped[1].dataset.em) {
            pMatched++; setText('love-pairs-score', `${pMatched} / ${PAIR_EM.length}`);
            pFlipped = [];
            if (pMatched === PAIR_EM.length) {
                setText('love-pairs-status', 'Parabéns! Todos os pares! 💕');
                confetti(40); unlockAch('pairs');
            }
        } else {
            setTimeout(() => {
                pFlipped.forEach(c => { c.dataset.open = '0'; c.textContent = '💗'; c.classList.remove('matched'); });
                pFlipped = [];
            }, 850);
        }
    }
}

/* ── 10. DESAFIO ─────────────────────────────────────────── */
const CHAL = [
    {
        q: 'O que você mais gosta no Kauê?',
        o: ['Sorriso dele', 'Como ele te olha', 'Jeito carinhoso', 'Tudo nele 💕'], a: 3
    },
    {
        q: 'Encontro perfeito pra vocês?',
        o: ['Cinema e jantar', 'Passeio ao ar livre', 'Ficar em casa juntos', 'Qualquer lugar com você'], a: 3
    },
    {
        q: 'Se vocês fossem uma música, seria:',
        o: ['Saturno', 'Perfect', 'All of Me', 'Nossa própria música'], a: 3
    },
    {
        q: 'O que define esse amor?',
        o: ['Parceria', 'Intensidade', 'Cumplicidade', 'Todos os três 💕'], a: 3
    },
    {
        q: 'Como você descreveria o Kauê?',
        o: ['Carinhoso', 'Engraçado', 'Protetor', 'Perfeito do jeito que é 💖'], a: 3
    },
];
let cIdx = 0, cScore = 0;

function initChallenge() { cIdx = 0; cScore = 0; renderChal(); }

function renderChal() {
    const wrap = $('challenge-wrap'); if (!wrap) return;
    if (cIdx >= CHAL.length) {
        wrap.innerHTML = `
      <div class="challenge-score">${cScore}/${CHAL.length} 💕</div>
      <p style="color:var(--muted);text-align:center;margin-top:.5rem">Vocês são perfeitos juntos! 💕</p>
      <button onclick="initChallenge()" style="margin:1rem auto;display:block;background:rgba(232,100,122,.15);border:1px solid rgba(232,100,122,.3);color:var(--rose-s);padding:.55rem 1.3rem;border-radius:50px;cursor:pointer;font-size:.8rem;font-weight:600;">Jogar novamente ↺</button>`;
        unlockAch('challenge'); return;
    }
    const c = CHAL[cIdx];
    wrap.innerHTML = `
    <div class="challenge-q">Desafio ${cIdx + 1}: ${c.q}</div>
    <div class="challenge-opts">
      ${c.o.map((o, i) => `<button class="challenge-opt" onclick="chalAnswer(${i})">${o}</button>`).join('')}
    </div>
    <div class="challenge-score">${cScore} pts</div>`;
}

function chalAnswer(idx) {
    const c = CHAL[cIdx];
    $$('.challenge-opt').forEach(o => o.disabled = true);
    const opts = $$('.challenge-opt');
    opts[idx].classList.add(idx === c.a ? 'correct' : 'wrong');
    opts[c.a].classList.add('correct');
    if (idx === c.a) { cScore++; confetti(10); }
    setTimeout(() => { cIdx++; renderChal(); }, 1300);
}

/* ── 11. SNAKE ───────────────────────────────────────────── */
let snakeReady = false, snakeCV = null, snakeCTX = null, snakeG = null;

function initSnake() {
    snakeReady = true;
    snakeCV = $('snake-canvas'); if (!snakeCV) return;
    snakeCTX = snakeCV.getContext('2d');
    const sz = Math.min(360, window.innerWidth - 64);
    snakeCV.width = sz; snakeCV.height = sz;
    snakeCV.onclick = snakeTap;
    resetSnake();
}

function snakeTap() {
    if (!snakeG) return;
    if (!snakeG.running) {
        snakeG.running = true;
        snakeG.iv = setInterval(snakeStep, 130);
        setText('snake-msg', '');
    }
}

function resetSnake() {
    if (snakeG) clearInterval(snakeG.iv);
    const sz = snakeCV.width, cell = 20, grid = Math.floor(sz / cell);
    snakeG = {
        snake: [{ x: Math.floor(grid / 2), y: Math.floor(grid / 2) }],
        dir: { x: 1, y: 0 }, next: { x: 1, y: 0 },
        food: { x: rni(0, grid - 1), y: rni(0, grid - 1) },
        score: 0, cell, grid, running: false, iv: null
    };
    snakeDraw();
    setText('snake-score-val', 0);
    setText('snake-hi-val', HI_SNAKE);
    setText('snake-msg', 'Clique no campo para iniciar! 🐍');
    if (snakeCV) snakeCV.onclick = snakeTap;
}

document.addEventListener('keydown', e => {
    if (!snakeG || !snakeG.running) return;
    const panel = $('gp-10');
    if (!panel || !panel.classList.contains('active')) return;
    const d = snakeG.next;
    if (e.key === 'ArrowUp' && snakeG.dir.y !== 1) snakeG.next = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && snakeG.dir.y !== -1) snakeG.next = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && snakeG.dir.x !== 1) snakeG.next = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && snakeG.dir.x !== -1) snakeG.next = { x: 1, y: 0 };
    e.preventDefault();
});

function snakeDir(dx, dy) {
    if (!snakeG) return;
    if (dx === 1 && snakeG.dir.x !== -1) snakeG.next = { x: 1, y: 0 };
    if (dx === -1 && snakeG.dir.x !== 1) snakeG.next = { x: -1, y: 0 };
    if (dy === -1 && snakeG.dir.y !== 1) snakeG.next = { x: 0, y: -1 };
    if (dy === 1 && snakeG.dir.y !== -1) snakeG.next = { x: 0, y: 1 };
}

function snakeStep() {
    const g = snakeG; if (!g.running) return;
    g.dir = { ...g.next };
    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
    const dead = head.x < 0 || head.x >= g.grid || head.y < 0 || head.y >= g.grid
        || g.snake.some(s => s.x === head.x && s.y === head.y);
    if (dead) {
        g.running = false; clearInterval(g.iv);
        setText('snake-msg', `Game Over! Score: ${g.score} 💔 Clique para reiniciar`);
        if (g.score > HI_SNAKE) { HI_SNAKE = g.score; localStorage.setItem('kg_snake_hi', HI_SNAKE); setText('snake-hi-val', HI_SNAKE); }
        if (g.score >= 20) unlockAch('snake20');
        if (snakeCV) snakeCV.onclick = () => { snakeCV.onclick = snakeTap; resetSnake(); };
        return;
    }
    g.snake.unshift(head);
    if (head.x === g.food.x && head.y === g.food.y) {
        g.score++; setText('snake-score-val', g.score);
        g.food = { x: rni(0, g.grid - 1), y: rni(0, g.grid - 1) };
    } else g.snake.pop();
    snakeDraw();
}

function snakeDraw() {
    const g = snakeG; if (!g || !snakeCTX) return;
    const ctx = snakeCTX, c = g.cell, W = snakeCV.width;
    ctx.fillStyle = '#030209'; ctx.fillRect(0, 0, W, W);
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,.025)'; ctx.lineWidth = .5;
    for (let i = 0; i < g.grid; i++) {
        ctx.beginPath(); ctx.moveTo(i * c, 0); ctx.lineTo(i * c, W); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * c); ctx.lineTo(W, i * c); ctx.stroke();
    }
    // food
    ctx.font = `${c - 2}px serif`;
    ctx.fillText('🍎', g.food.x * c + 1, g.food.y * c + c - 2);
    // snake
    g.snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#e8647a' : `hsl(${345 - i * 4},65%,${52 + i}%)`;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(s.x * c + 1, s.y * c + 1, c - 2, c - 2, 4);
        else ctx.rect(s.x * c + 1, s.y * c + 1, c - 2, c - 2);
        ctx.fill();
    });
}

/* ── 12. DIGITAÇÃO ───────────────────────────────────────── */
let typingReady = false;
const TYPE_PHRASES = [
    'Eu te amo, Gyovanna, do fundo do meu coração.',
    'Cada dia ao seu lado é o melhor da minha vida.',
    'Você é minha constelação favorita no universo.',
    'Nosso amor é de outro mundo mesmo, tipo Saturno.',
    'Desde 20 de junho de 2025 tudo faz mais sentido.',
];
let tPhrase = '', tStarted = false, tStart = 0;

function initTyping() {
    typingReady = true;
    tPhrase = pick(TYPE_PHRASES); tStarted = false;
    renderTyping();
    const inp = $('typing-input');
    if (inp) {
        inp.value = ''; inp.disabled = false;
        // remove and re-add listener to avoid duplicates
        inp.oninput = handleTyping;
        setTimeout(() => inp.focus(), 100);
    }
    setText('typing-wpm', '0');
    setText('typing-acc', '100%');
    setText('typing-time', '0s');
}

function renderTyping() {
    const el = $('typing-text'); if (!el) return;
    el.innerHTML = tPhrase.split('').map((ch, i) =>
        `<span class="char${i === 0 ? ' current' : ''}">${ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch}</span>`
    ).join('');
}

function handleTyping(e) {
    const val = e.target.value;
    if (!tStarted && val.length > 0) { tStarted = true; tStart = Date.now(); }
    const chars = $$('.char'); let correct = 0;
    chars.forEach((c, i) => {
        c.classList.remove('correct', 'wrong', 'current');
        if (i < val.length) {
            if (val[i] === tPhrase[i]) { c.classList.add('correct'); correct++; }
            else c.classList.add('wrong');
        } else if (i === val.length) c.classList.add('current');
    });
    const secs = tStarted ? Math.max(1, (Date.now() - tStart) / 1000) : 1;
    const wpm = Math.round((val.length / 5) / (secs / 60));
    const acc = val.length ? Math.round(correct / val.length * 100) : 100;
    setText('typing-wpm', wpm);
    setText('typing-acc', acc + '%');
    setText('typing-time', Math.floor(secs) + 's');
    if (val === tPhrase) {
        e.target.disabled = true;
        toast(`⌨️ Frase completa! ${wpm} WPM! 🎉`);
        confetti(32);
        if (wpm >= 60) unlockAch('type60');
        if (wpm > HI_TYPE) { HI_TYPE = wpm; localStorage.setItem('kg_typing_best', HI_TYPE); }
        setTimeout(initTyping, 2000);
    }
}

/* ── EXPOSE GLOBAL ───────────────────────────────────────── */
window.switchGame = switchGame;
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
