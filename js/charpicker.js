'use strict';

/* ═══════════════════════════════════════════════
   TOKEN MODAL
   — Each character has a unique secret token.
   — Wrong token shows "You are not invited."
   — Correct token resolves to that character
     and transitions to screen 3.
═══════════════════════════════════════════════ */

// ── Secret tokens (case-sensitive) ──────────────
const TOKEN_MAP = {
  'RMD-ALV-1446': 'you',      // Alven   — The Host
  'GHST-0013-NR': 'ghost',    // Ghost   — The Mystery
  'MONA-ROOFTOP': 'mona',     // Mona    — The Warmth
  'DN-LIGHT-1446': 'dounya',  // Dounya  — The Light
};

let chosenChar = null;

/* ─── Open / close ──────────────────────────── */
function openCharPicker() {
  const modal = document.getElementById('tokenModal');
  modal.classList.add('show');
  makeStars('tokenStars', 100, .85);

  // Reset state
  chosenChar = null;
  const inp = document.getElementById('tokenInput');
  inp.value = '';
  inp.classList.remove('wrong');
  setStatus('', '');
  document.getElementById('tmBox').classList.remove('success');
  setTimeout(() => inp.focus(), 400);
}

function closeTokenModal() {
  document.getElementById('tokenModal').classList.remove('show');
}

/* ─── Status helper ─────────────────────────── */
function setStatus(msg, type) {
  const el = document.getElementById('tmStatus');
  el.textContent = msg;
  el.className = 'tm-status ' + (type || 'empty');
}

/* ─── Token validation ──────────────────────── */
function validateToken(raw) {
  const token = raw.trim();
  if (!token) {
    setStatus('Please enter your token.', 'err');
    shake();
    return;
  }

  const char = TOKEN_MAP[token];

  if (char) {
    // ✓ Valid
    chosenChar = char;
    const names = { you:'Alven', ghost:'Ghost', mona:'Mona', dounya:'Dounya' };
    const roles = { you:'The Host', ghost:'The Mystery', mona:'The Warmth', dounya:'The Light' };

    document.getElementById('tmBox').classList.add('success');
    setStatus(`Welcome, ${names[char]} — ${roles[char]} 🌙`, 'ok');

    // Particle burst on box centre
    const box = document.getElementById('tmBox').getBoundingClientRect();
    burst(box.left + box.width / 2, box.top + box.height / 2, 30);

    // Disable input/button
    document.getElementById('tokenInput').disabled = true;
    document.getElementById('tokenSubmit').disabled = true;

    // Transition after brief celebration
    setTimeout(() => {
      closeTokenModal();
      setTimeout(() => goTo(3), 400);
    }, 1600);

  } else {
    // ✗ Wrong token
    chosenChar = null;
    setStatus('You are not invited. This token is unknown.', 'err');
    shake();
  }
}

function shake() {
  const inp = document.getElementById('tokenInput');
  inp.classList.remove('wrong');
  void inp.offsetWidth; // reflow to restart animation
  inp.classList.add('wrong');
  setTimeout(() => inp.classList.remove('wrong'), 500);
}

/* ─── Event listeners ───────────────────────── */
document.getElementById('tokenSubmit').addEventListener('click', () => {
  validateToken(document.getElementById('tokenInput').value);
});

document.getElementById('tokenInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') validateToken(e.target.value);
  // Clear error styling on type
  if (e.key !== 'Enter') {
    e.target.classList.remove('wrong');
    setStatus('', '');
  }
});

/* ─── Expose globally ───────────────────────── */
function getChosenChar() { return chosenChar || 'you'; }
window.getChosenChar  = getChosenChar;
window.openCharPicker = openCharPicker;
