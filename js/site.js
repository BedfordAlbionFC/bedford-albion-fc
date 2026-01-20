(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === path) {
      a.style.color = '#fff';
    }
  });
})();
// Highlight Bedford Albion inside the homepage "Next Match" Full-Time embed (if not in an iframe)
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  if (path !== 'index.html') return;

  const teamName = 'Bedford Albion'; // change if Full-Time uses slightly different text
  const root = document.getElementById('next-match-widget');
  if (!root) return;

  const highlight = () => {
    // Find candidate rows inside the embed output
    const rows = root.querySelectorAll('tr, li, .row, div');
    if (!rows || rows.length === 0) return false;

    let found = false;

    rows.forEach(r => {
      const txt = (r.innerText || '').toLowerCase();
      if (!txt) return;

      if (txt.includes(teamName.toLowerCase())) {
        r.classList.add('albion-row');
        found = true;
      } else {
        // Only dim real "row-like" elements a bit
        if (r.tagName === 'TR' || r.tagName === 'LI') r.classList.add('dim-row');
      }
    });

    return found;
  };

  // Try immediately + after short delays (Full-Time loads async)
  const attempts = [200, 600, 1200, 2000, 3500];
  attempts.forEach(ms => setTimeout(() => highlight(), ms));

  // Observe changes in case Full-Time updates after load
  const obs = new MutationObserver(() => highlight());
  obs.observe(root, { childList: true, subtree: true });
})();
