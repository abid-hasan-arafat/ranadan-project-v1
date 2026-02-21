'use strict';

/* ═══════════════════════════════
   SCREEN 3 — DESCENT
═══════════════════════════════ */
function initS3() {
  makeStars('s3Stars', 320, .62);
  makeLanterns('s3Lanterns', LANTERN_DEFS);

  // Reset zoom animation by cloning the zoom wrapper node
  const old = document.getElementById('s3Zoom');
  const clone = old.cloneNode(true);
  old.parentNode.replaceChild(clone, old);

  // Re-attach lanterns to the fresh clone
  makeLanterns('s3Lanterns', LANTERN_DEFS);
}

document.getElementById('s3Enter').addEventListener('click', () => goTo(4));
