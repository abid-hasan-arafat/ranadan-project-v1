'use strict';

/* ═══════════════════════════════
   SCREEN 1 — ARRIVAL
═══════════════════════════════ */
function initS1() {
  makeStars('s1Stars', 280, .75, { stagger: true });
  makeLanterns('s1Lanterns', LANTERN_DEFS);
}

document.getElementById('s1Enter').addEventListener('click', () => {
  startAudio();
  goTo(2);
});

document.getElementById('s1Skip').addEventListener('click', () => goTo(2));
