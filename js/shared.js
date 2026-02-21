'use strict';

/* ─── CURSOR ──────────────────────────────── */
const cur = document.getElementById('cursor');
const crg = document.getElementById('cursorRing');
let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
document.addEventListener('touchmove', e => {
  const t = e.touches[0]; mx = t.clientX; my = t.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
}, { passive: true });
(function ringLoop() {
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  crg.style.left = rx + 'px'; crg.style.top = ry + 'px';
  requestAnimationFrame(ringLoop);
})();
document.addEventListener('mousedown', () => {
  cur.style.transform = 'translate(-50%,-50%) scale(2)';
  crg.style.width = '12px'; crg.style.height = '12px';
});
document.addEventListener('mouseup', () => {
  cur.style.transform = 'translate(-50%,-50%) scale(1)';
  crg.style.width = '28px'; crg.style.height = '28px';
});

/* ─── SCREEN MANAGER ─────────────────────── */
let currentScreen = 1;

function goTo(n) {
  if (n === currentScreen) return;
  const ov = document.getElementById('transOverlay');
  ov.classList.add('on');
  setTimeout(() => {
    document.getElementById('s' + currentScreen).classList.remove('active');
    const next = document.getElementById('s' + n);
    next.classList.add('active');
    currentScreen = n;
    if (n === 1) initS1();
    if (n === 2) initS2();
    if (n === 3) initS3();
    if (n === 4) initS4();
    setTimeout(() => ov.classList.remove('on'), 200);
  }, 900);
}

/* ─── STAR CANVAS FACTORY ────────────────── */
function makeStars(canvasId, count, maxY, opts) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  window.addEventListener('resize', () => { c.width = window.innerWidth; c.height = window.innerHeight; });

  const stars = Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random() * (maxY || .75),
    r: Math.random() * 1.3 + .2,
    a: Math.random() * .5 + .15,
    sp: Math.random() * .012 + .003,
    off: Math.random() * Math.PI * 2,
    col: Math.random() > .82 ? '232,201,122' : Math.random() > .65 ? '180,210,255' : '255,252,240',
    born: (opts && opts.stagger) ? Math.random() * 8000 : 0
  }));

  let start = null;
  function draw(ts) {
    if (!start) start = ts;
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(s => {
      if (opts && opts.stagger && (ts - start) < s.born) return;
      const age = (opts && opts.stagger) ? Math.min((ts - start - s.born) / 2000, 1) : 1;
      const al = s.a * (.55 + .45 * Math.sin(ts * s.sp + s.off)) * age;
      const g = ctx.createRadialGradient(s.x * c.width, s.y * c.height, 0, s.x * c.width, s.y * c.height, s.r * 2.5);
      g.addColorStop(0, `rgba(${s.col},${al})`);
      g.addColorStop(.4, `rgba(${s.col},${al * .4})`);
      g.addColorStop(1, `rgba(${s.col},0)`);
      ctx.beginPath(); ctx.arc(s.x * c.width, s.y * c.height, s.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(s.x * c.width, s.y * c.height, s.r * .4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.col},${al})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ─── LANTERN FACTORY ────────────────────── */
const LANTERN_DEFS = [
  { l: '5%', sz: 24, col: '#e8501a', dl: 0 }, { l: '11%', sz: 18, col: '#e8c97a', dl: .5 },
  { l: '18%', sz: 22, col: '#c94040', dl: .9 }, { l: '25%', sz: 16, col: '#e89a1a', dl: .2 },
  { l: '75%', sz: 20, col: '#e8c97a', dl: .4 }, { l: '82%', sz: 24, col: '#c94040', dl: .7 },
  { l: '88%', sz: 18, col: '#e8501a', dl: 1.1 }, { l: '94%', sz: 16, col: '#e89a1a', dl: .3 },
];

function makeLanterns(containerId, defs) {
  const ll = document.getElementById(containerId);
  if (!ll) return;
  ll.innerHTML = '';
  defs.forEach(d => {
    const w = document.createElement('div');
    w.style.cssText = `position:absolute;left:${d.l};bottom:0;display:flex;flex-direction:column;align-items:center;`;
    const ro = document.createElement('div');
    ro.style.cssText = `width:1px;height:${50 + Math.random() * 36}px;background:linear-gradient(to bottom,transparent,rgba(180,140,55,.46));`;
    const b = document.createElement('div');
    const bh = Math.round(d.sz * 1.6);
    b.style.cssText = `width:${d.sz}px;height:${bh}px;border-radius:40% 40% 52% 52%;background:radial-gradient(ellipse at 38% 32%,rgba(255,255,200,.88),${d.col} 58%,rgba(50,8,0,.82));box-shadow:0 0 ${d.sz}px ${d.col},0 0 ${d.sz * 2}px ${d.col}44;animation:lanternSway ${3.5 + Math.random() * 2}s ease-in-out ${d.dl}s infinite;transform-origin:top center;`;
    w.appendChild(ro); w.appendChild(b); ll.appendChild(w);
  });
}

/* ─── GRAIN ──────────────────────────────── */
const gc = document.getElementById('grain'), gx = gc.getContext('2d');
gc.width = window.innerWidth; gc.height = window.innerHeight;
window.addEventListener('resize', () => { gc.width = window.innerWidth; gc.height = window.innerHeight; });
(function grain() {
  const id = gx.createImageData(gc.width, gc.height), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 16; }
  gx.putImageData(id, 0, 0); setTimeout(grain, 90);
})();

/* ─── AUDIO ──────────────────────────────── */
let actx = null, audioOn = false;
function startAudio() {
  if (audioOn || (!window.AudioContext && !window.webkitAudioContext)) return;
  audioOn = true;
  actx = new (window.AudioContext || window.webkitAudioContext)();
  const buf = actx.createBuffer(1, actx.sampleRate * 3, actx.sampleRate);
  const dat = buf.getChannelData(0);
  for (let i = 0; i < dat.length; i++) dat[i] = Math.random() * 2 - 1;
  const ns = actx.createBufferSource(); ns.buffer = buf; ns.loop = true;
  const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 400; bp.Q.value = .3;
  const ng = actx.createGain(); ng.gain.value = .02;
  ns.connect(bp); bp.connect(ng); ng.connect(actx.destination); ns.start();

  function tone(f, v, at, rel, w) {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0, w); g.gain.linearRampToValueAtTime(v, w + at); g.gain.linearRampToValueAtTime(0, w + at + rel);
    o.connect(g); g.connect(actx.destination); o.start(w); o.stop(w + at + rel + .1);
  }
  const notes = [196, 220, 246.94, 261.63, 293.66, 246.94, 220, 196];
  const gaps = [2.8, 2.2, 3, 2.5, 2.2, 3, 2.5, 4.5];
  let t = actx.currentTime + .5;
  function loop() { notes.forEach((f, i) => { tone(f, .06, .6, 2.8, t); tone(f * .5, .028, .9, 3.5, t); t += gaps[i]; }); setTimeout(loop, (t - actx.currentTime - 2) * 1000); }
  loop();
}
document.addEventListener('click', startAudio, { once: true });
document.addEventListener('touchstart', startAudio, { once: true });

/* ─── PARTICLE BURST ─────────────────────── */
function burst(cx, cy, n = 20) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div'), ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 130;
    p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${2 + Math.random() * 4}px;height:${2 + Math.random() * 4}px;background:rgba(${Math.random() > .5 ? '232,201,122' : '210,220,255'},${.6 + Math.random() * .4});border-radius:50%;pointer-events:none;z-index:6000;box-shadow:0 0 6px rgba(232,201,122,.7);animation:pfly ${.7 + Math.random() * .8}s ease forwards ${Math.random() * .1}s;--tx:${Math.cos(ang) * dist}px;--ty:${Math.sin(ang) * dist}px;`;
    document.body.appendChild(p); setTimeout(() => p.remove(), 1800);
  }
}

// Inject particle keyframe
const pKF = document.createElement('style');
pKF.textContent = '@keyframes pfly{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)}}';
document.head.appendChild(pKF);
