'use strict';

/* ═══════════════════════════════
   SCREEN 2 — INVITATION CARD
═══════════════════════════════ */
let envelopeOpened = false;

function initS2() {
  makeStars('s2Stars', 180, 1);
  envelopeOpened = false;
  document.getElementById('envFlap').classList.remove('open');
  document.getElementById('waxSeal').classList.remove('cracked');
  document.getElementById('cardWrap').classList.remove('up');
  document.getElementById('inviteCard').classList.remove('anim');
  document.getElementById('envHint').style.opacity = '1';
  document.getElementById('envWrap').style.transform = '';
}

document.getElementById('envBody').addEventListener('click', function (e) {
  if (envelopeOpened) return;
  envelopeOpened = true;
  startAudio();
  document.getElementById('waxSeal').classList.add('cracked');
  burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 26);
  document.getElementById('envHint').style.opacity = '0';
  setTimeout(() => document.getElementById('envFlap').classList.add('open'), 500);
  setTimeout(() => document.getElementById('cardWrap').classList.add('up'), 1300);
  setTimeout(() => {
    document.getElementById('inviteCard').classList.add('anim');
    burst(window.innerWidth / 2, window.innerHeight * .45, 16);
  }, 1700);
});

// Envelope parallax tilt
document.addEventListener('mousemove', function (e) {
  if (currentScreen !== 2 || envelopeOpened) return;
  const cx = (e.clientX / window.innerWidth - .5) * 14;
  const cy = (e.clientY / window.innerHeight - .5) * 8;
  document.getElementById('envWrap').style.transform = `rotateY(${cx * .4}deg) rotateX(${-cy * .3}deg)`;
});

// "Enter the Rooftop" → open character picker instead of jumping straight to s3
document.getElementById('s2Enter').addEventListener('click', () => openCharPicker());
