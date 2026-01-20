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
 // Homepage: make the Full-Time embed behave like a true "Next Match" box
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  if (path !== 'index.html') return;

  const root = document.getElementById('next-match-widget');
  if (!root) return;

  const SHOW_ROWS = 1; // change to 3 if you want "Next 3"

  const styleAsNextMatch = () => {
    // Prefer table rows if present
    const tableRows = Array.from(root.querySelectorAll('tr'));

    if (tableRows.length) {
      // Keep header row if it exists (sometimes first row is header-ish)
      // We'll detect rows that actually contain teams by checking for "Bedford" or a score dash
      const dataRows = tableRows.filter(r => {
        const t = (r.innerText || '').trim();
        return t.length > 0 && /bedford| v | - /i.test(t);
      });

      if (!dataRows.length) return false;

      // Hide all data rows except the first SHOW_ROWS
      dataRows.forEach((r, idx) => {
        r.style.display = idx < SHOW_ROWS ? '' : 'none';
        r.classList.remove('albion-row', 'dim-row');
        if (idx === 0) r.classList.add('albion-row');
      });

      return true;
    }

    // Fallback: list items (some embeds render as <li>)
    const lis = Array.from(root.querySelectorAll('li'));
    if (lis.length) {
      lis.forEach((li, idx) => {
        li.style.display = idx < SHOW_ROWS ? '' : 'none';
        li.classList.remove('albion-row', 'dim-row');
        if (idx === 0) li.classList.add('albion-row');
      });
      return true;
    }

    return false;
  };

  // Try after load + a few retries (Full-Time loads async)
  [200, 600, 1200, 2000, 3500].forEach(ms => setTimeout(styleAsNextMatch, ms));

  // Observe for updates
  const obs = new MutationObserver(() => styleAsNextMatch());
  obs.observe(root, { childList: true, subtree: true });
})();

