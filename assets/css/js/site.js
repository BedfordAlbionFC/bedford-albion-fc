(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === path) {
      a.style.color = '#fff';
    }
  });
})();
// Rotating Sponsor Spotlight (Homepage)
// - Rotates daily (fair exposure)
// - Also rotates between visits using localStorage
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  if (path !== 'index.html') return;

  const box = document.getElementById('sponsor-spotlight');
  if (!box) return;

  // Update these anytime when sponsors change
  const sponsors = [
    {
      name: "Creams Bedford",
      href: "https://www.creamscafe.com/our-stores/bedford/",
      img: "assets/img/sponsors/creams.png",
      isPrimary: true
    },
    {
      name: "CryoHub Bedford",
      href: "https://cryohub-uk.com/optin1686560051394",
      img: "assets/img/sponsors/cryohub.png"
    },
    {
      name: "FRY Estate Agents",
      href: "https://www.fryestateagents.co.uk/",
      img: "assets/img/sponsors/fry.png"
    },
    {
      name: "Oasis Valeting & Detailing",
      href: "https://oasisvaletingbeds.co.uk/",
      img: "assets/img/sponsors/oasis.png"
    },
    {
      name: "PB Property Services",
      href: "https://www.instagram.com/pb_propertyservices/",
      img: "assets/img/sponsors/pb.png"
    },
    {
      name: "ProAssist Property Services Ltd",
      href: "https://www.pro-assist.co.uk/",
      img: "assets/img/sponsors/proassist.png"
    }
  ];

  // Fair rotation:
  // Use day-of-year as base index; offset by a per-browser rolling counter
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000); // 1..366-ish

  const key = "ba_sponsor_spotlight_offset";
  const prev = parseInt(localStorage.getItem(key) || "0", 10);
  const offset = isNaN(prev) ? 0 : prev;

  // Every new day, bump offset so repeat visitors see variety
  const dayKey = "ba_sponsor_spotlight_day";
  const lastDay = parseInt(localStorage.getItem(dayKey) || "0", 10);
  if (lastDay !== dayOfYear) {
    localStorage.setItem(dayKey, String(dayOfYear));
    localStorage.setItem(key, String((offset + 1) % sponsors.length));
  }

  const finalOffset = parseInt(localStorage.getItem(key) || "0", 10) || 0;
  const idx = (dayOfYear + finalOffset) % sponsors.length;
  const s = sponsors[idx];

  // Populate UI
  const title = box.querySelector(".spotlight-title");
  const link = box.querySelector(".spotlight-right");
  const img = box.querySelector("img");

  if (title) title.textContent = s.isPrimary ? `${s.name} (Primary Sponsor)` : s.name;

  if (link) {
    link.href = s.href;
    link.setAttribute("aria-label", `Visit ${s.name}`);
  }

  if (img) {
    img.src = s.img;
    img.alt = s.name;
    img.loading = "lazy";
  }
})();
