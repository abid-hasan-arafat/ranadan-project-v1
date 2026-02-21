'use strict';

/* ═══════════════════════════════
   SCREEN 4 — THE LIVING ROOFTOP
═══════════════════════════════ */

const ALL_CHARS = ['you', 'ghost', 'mona', 'dounya'];

const CHAR_META_S4 = {
  you:    { displayName: 'Alven',    emoji: '🌙', color: 'rgba(232,201,122,.72)' },
  ghost:  { displayName: 'Ghost',  emoji: '👓', color: 'rgba(200,215,255,.62)' },
  mona:   { displayName: 'Mona',   emoji: '🌸', color: 'rgba(255,150,180,.62)' },
  dounya: { displayName: 'Dounya', emoji: '✨', color: 'rgba(100,210,200,.62)' },
};

function initS4() {
  makeStars('s4Stars', 300, .65);
  makeLanterns('s4Lanterns', LANTERN_DEFS);

  document.getElementById('chatPanel').classList.add('show');
  document.getElementById('iftarWrap').classList.add('show');
  document.getElementById('presencePanel').classList.add('show');

  const player = getChosenChar();

  ALL_CHARS.forEach(id => {
    const el    = document.getElementById('char-' + id);
    const pbBtn = document.getElementById('pb-' + id);
    const stEl  = document.getElementById(id + '-status');

    if (id === player) {
      el.classList.remove('ghostMode', 'matAnim');
      el.classList.add('online');
      if (pbBtn) pbBtn.classList.add('on');
      if (stEl) {
        stEl.classList.remove('ncOffline');
        stEl.classList.add('ncOnline');
        stEl.textContent = '● online (you)';
      }
      if (pbBtn) pbBtn.style.pointerEvents = 'none';
    } else {
      el.classList.remove('online', 'matAnim');
      el.classList.add('ghostMode');
      if (pbBtn) pbBtn.classList.remove('on');
      if (pbBtn) pbBtn.style.pointerEvents = '';
      presState[id] = false;
      if (stEl) {
        stEl.classList.remove('ncOnline');
        stEl.classList.add('ncOffline');
        stEl.textContent = '◌ not yet here';
      }
    }
  });
  presState[player] = true;

  const chatInputEl = document.getElementById('chatInput');
  const meta = CHAR_META_S4[player];
  if (chatInputEl) chatInputEl.placeholder = `say something as ${meta.displayName}…`;

  startIftarTimer();
  setTimeout(() => addMsg(player, openingLine(player)), 1800);
  setTimeout(() => addMsg(player, "Look at that moon… أجمل شي"), 5500);
}

function openingLine(id) {
  const lines = {
    you:    "I built this for you all 🌙 Ramadan Mubarak",
    ghost:  "رمضان كريم everyone — Ghost is here 👓",
    mona:   "يا ربي this rooftop is everything 🌸 Ramadan Mubarak!",
    dounya: "YALL the moon is so beautiful tonight ✨ Ramadan Mubarak!",
  };
  return lines[id] || lines.you;
}

/* ─── PRESENCE ───────────────────────────── */
const presState = { ghost: false, mona: false, dounya: false, you: false };

const charLines = {
  ghost:  ["رمضان كريم everyone 👓", "The Ghost has arrived 🌙", "Did someone say oud music?"],
  mona:   ["يا ربي how beautiful is this moon 🌸", "Mona is HERE 🤍", "This rooftop is everything ✨"],
  dounya: ["YALL I'm finally here 😭", "Dounya has entered the chat ✨", "This is SO beautiful omg 🌙"],
  you:    ["I built this for all of you 🌙", "Welcome home 🌙", "Tonight belongs to us."],
};

function toggleChar(id) {
  if (id === getChosenChar()) return;

  const el   = document.getElementById('char-' + id);
  const btn  = document.getElementById('pb-' + id);
  const stEl = document.getElementById(id + '-status');

  if (!presState[id]) {
    presState[id] = true;
    el.classList.remove('ghostMode');
    el.classList.add('matAnim');
    if (btn) btn.classList.add('on');
    if (stEl) {
      stEl.classList.remove('ncOffline');
      stEl.classList.add('ncOnline');
      stEl.textContent = '● online';
    }
    setTimeout(() => { el.classList.remove('matAnim'); el.classList.add('online'); }, 1900);
    const rect = el.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
    const msgs = charLines[id];
    setTimeout(() => addMsg(id, msgs[Math.floor(Math.random() * msgs.length)]), 1300);
  } else {
    presState[id] = false;
    el.classList.remove('online', 'matAnim');
    el.classList.add('ghostMode');
    if (btn) btn.classList.remove('on');
    if (stEl) {
      stEl.classList.remove('ncOnline');
      stEl.classList.add('ncOffline');
      stEl.textContent = '◌ not yet here';
    }
  }
}

window.toggleChar = toggleChar;

/* ─── CHAT ───────────────────────────────── */
const CNAMES = { you:'Alven', ghost:'Ghost', mona:'Mona', dounya:'Dounya' };
let msgCount = 0;

function addMsg(who, text) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  if (msgCount > 40) msgs.firstChild && msgs.firstChild.remove();
  const div = document.createElement('div');
  div.className = `chatMsg msg-${who}`;
  div.innerHTML = `<div class="msgWho">${CNAMES[who] || who}</div><div class="msgText">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  msgCount++;
  setTimeout(() => { div.classList.add('fading'); setTimeout(() => div.remove(), 2000); }, 60000);
}

const chatSend  = document.getElementById('chatSend');
const chatInput = document.getElementById('chatInput');

function sendMsg() {
  const t = chatInput.value.trim();
  if (!t) return;
  addMsg(getChosenChar(), t);
  chatInput.value = '';
}

chatSend.addEventListener('click', sendMsg);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

/* ─── IFTAR TIMER ────────────────────────── */
let iftarRunning = false;

function startIftarTimer() {
  if (iftarRunning) return;
  iftarRunning = true;
  tick();
}

function tick() {
  if (currentScreen !== 4) { iftarRunning = false; return; }
  const now = new Date();
  const tgt = new Date(now);
  tgt.setHours(18, 45, 0, 0);
  if (now > tgt) tgt.setDate(tgt.getDate() + 1);
  const diff = tgt - now;
  if (diff <= 0) {
    document.getElementById('iftarTime').textContent = 'إفطار!';
    document.getElementById('iftarCelebration').classList.add('show');
    iftarRunning = false;
    return;
  }
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('iftarTime').textContent = `${pad(h)} : ${pad(m)} : ${pad(s)}`;
  setTimeout(tick, 1000);
}
