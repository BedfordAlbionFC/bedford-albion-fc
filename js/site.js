(() => {
  // Highlight active nav
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.style.background = 'rgba(255,255,255,.08)';
  });
})();

// Homepage: turn the Full-Time feed into a true "Next Match" card
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  if (path !== 'index.html') return;

  const root = document.getElementById('next-match-widget');
  if (!root) return;

  // Keep ONLY the next fixture block.
  // Full-Time often renders each fixture as 2 consecutive rows (date row + match row).
  const keepNextFixture = () => {
    const rows = Array.from(root.querySelectorAll('tr'));
    if (!rows.length) return false;

    // Find rows that look like a "date/time header"
    const isDateRow = (txt) => {
      // Matches patterns like: "Sat 06 Sep 2025 14:30"
      return /\b(mon|tue|wed|thu|fri|sat|sun)\b/i.test(txt) && /\b\d{1,2}:\d{2}\b/.test(txt);
    };

    const dateRowIndexes = [];
    rows.forEach((r, idx) => {
      const t = (r.innerText || '').trim();
      if (t && isDateRow(t)) dateRowIndexes.push(idx);
    });

    // If we can detect date rows, keep the first fixture block from first date row up to before the second date row
    if (dateRowIndexes.length >= 1) {
      const start = dateRowIndexes[0];
      const end = dateRowIndexes.length >= 2 ? dateRowIndexes[1] : rows.length;

      rows.forEach((r, idx) => {
        const keep = idx >= start && idx < end;
        r.style.display = keep ? '' : 'none';
        r.classList.remove('albion-next');
      });

      // Highlight the kept block
      for (let i = start; i < end; i++) rows[i].classList.add('albion-next');
      return true;
    }

    // Fallback: if we can't detect date rows, just keep the first 2 rows
    rows.forEach((r, idx) => {
      const keep = idx < 2;
      r.style.display = keep ? '' : 'none';
      r.classList.toggle('albion-next', keep);
    });
    return true;
  };

  // Full-Time loads async: try a few times and observe changes
  [200, 600, 1200, 2000, 3500].forEach(ms => setTimeout(keepNextFixture, ms));
  const obs = new MutationObserver(() => keepNextFixture());
  obs.observe(root, { childList: true, subtree: true });
})();
