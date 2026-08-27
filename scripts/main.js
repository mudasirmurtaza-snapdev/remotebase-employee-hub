/* ================================================================
   Rendering + behaviour for the RemoteBase Employee Hub.
   Content lives in data/data.js (the HUB_DATA object) - this file
   should not need to change when content changes.
   ================================================================ */
const ICONS = {
  book:   '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5A1.5 1.5 0 015.5 4H12v15H5.5A1.5 1.5 0 014 17.5v-12z" stroke="currentColor" stroke-width="1.6"/><path d="M20 5.5A1.5 1.5 0 0018.5 4H12v15h6.5a1.5 1.5 0 001.5-1.5v-12z" stroke="currentColor" stroke-width="1.6"/></svg>',
  heart:  '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.35-7-9.5A3.5 3.5 0 0112 8a3.5 3.5 0 017 2.5C19 15.65 12 20 12 20z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 11h2l1-1.6L12.5 13l1-2h2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sun:    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  chart:  '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7 20V11M12 20V5M17 20v-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  users:  '<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M4 19a5 5 0 0110 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M16 6a3 3 0 010 6M15 14.5a5 5 0 014 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  laptop: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="11" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M2.5 20h19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};
const ARROW = '<svg class="arrow" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PLUS  = '<svg class="q-ic" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const CHAT  = '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v8A1.5 1.5 0 0118.5 15H9l-4 3.5V15H5.5A1.5 1.5 0 014 13.5v-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

const isSet = (href) => href && href !== "#";
const esc = (s) => s.replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

/* ---- Build category cards ---- */
const grid = document.getElementById("grid");
HUB_DATA.categories.forEach((cat, i) => {
  const card = document.createElement("section");
  card.className = "cat reveal";
  card.style.setProperty("--accent", cat.accent);
  card.style.animationDelay = (0.12 + i * 0.05) + "s";
  card.dataset.cat = cat.id;

  const linksHTML = cat.links.map(l => {
    if (isSet(l.href)) {
      return `<li data-text="${esc(l.label.toLowerCase())}"><a class="rlink" href="${esc(l.href)}" target="_blank" rel="noopener">
        <span class="dot"></span><span class="label">${esc(l.label)}</span>${ARROW}</a></li>`;
    }
    return `<li data-text="${esc(l.label.toLowerCase())}"><span class="rlink unset" title="Add the real link in data/data.js">
        <span class="dot"></span><span class="label">${esc(l.label)}</span><span class="todo">set link</span></span></li>`;
  }).join("");

  card.innerHTML = `
    <div class="cat-head">
      <span class="cat-ic">${ICONS[cat.icon] || ""}</span>
      <span class="cat-title">${esc(cat.title)}</span>
      <span class="cat-count"><span class="mono">${cat.links.length}</span></span>
    </div>
    <p class="cat-blurb">${esc(cat.blurb)}</p>
    <ul class="links">${linksHTML}</ul>`;
  grid.appendChild(card);
});

/* ---- Chips ---- */
const chipWrap = document.getElementById("chips");
HUB_DATA.chips.forEach(({ label, query }) => {
  const b = document.createElement("button");
  b.className = "chip"; b.textContent = label;
  b.onclick = () => { search.value = query; runFilter(); search.focus(); };
  chipWrap.appendChild(b);
});

/* ---- Contacts ---- */
const cg = document.getElementById("contacts-grid");
HUB_DATA.contacts.forEach(c => {
  const el = document.createElement("div");
  el.className = "contact reveal";
  const set = isSet(c.href);
  el.innerHTML = `
    <div class="who"><span class="who-name">${esc(c.name)}</span> - ${esc(c.who)}</div>
    <ul>${c.handles.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
    ${ set
      ? `<a class="cta" href="${esc(c.href)}" target="_blank" rel="noopener">${esc(c.cta)} →</a>`
      : `<span class="cta plain">${CHAT}<span>${esc(c.cta)}</span></span>` }`;
  cg.appendChild(el);
});

/* ---- FAQ ---- */
const fl = document.getElementById("faq-list");
HUB_DATA.faq.forEach(({ q, a }) => {
  const d = document.createElement("details");
  d.className = "qa";
  d.innerHTML = `<summary>${PLUS}<span>${esc(q)}</span></summary><div class="a">${esc(a)}</div>`;
  fl.appendChild(d);
});

/* ---- Emails ---- */
const fe = document.getElementById("footer-emails");
HUB_DATA.emails.forEach(e => {
  const a = document.createElement("a");
  a.href = "mailto:" + e; a.textContent = e; fe.appendChild(a);
});
document.getElementById("year").textContent = new Date().getFullYear();

/* ---- Live search ---- */
const search = document.getElementById("search");
const clearBtn = document.getElementById("clear");
const noresults = document.getElementById("noresults");
const cards = [...document.querySelectorAll(".cat")];

function runFilter() {
  const q = search.value.trim().toLowerCase();
  clearBtn.classList.toggle("show", q.length > 0);
  let anyVisible = false;

  cards.forEach(card => {
    const items = [...card.querySelectorAll(".links li")];
    const title = card.querySelector(".cat-title").textContent.toLowerCase();
    const blurb = card.querySelector(".cat-blurb").textContent.toLowerCase();
    let matchInCard = 0;

    items.forEach(li => {
      const text = li.dataset.text || "";
      const hit = !q || text.includes(q) || title.includes(q) || blurb.includes(q);
      li.classList.toggle("hide", !hit);
      if (hit) matchInCard++;
    });

    const show = matchInCard > 0;
    card.classList.toggle("hide", !show);
    if (show) anyVisible = true;
  });

  noresults.classList.toggle("show", !anyVisible);
}

search.addEventListener("input", runFilter);
clearBtn.addEventListener("click", () => { search.value = ""; runFilter(); search.focus(); });

/* ---- Keyboard: "/" focuses, Esc clears ---- */
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== search) { e.preventDefault(); search.focus(); }
  if (e.key === "Escape" && document.activeElement === search) { search.value = ""; runFilter(); search.blur(); }
});
