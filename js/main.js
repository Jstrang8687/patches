// Renders galleries, print formats, the piece popup, and the custom order form from works.js.
(function () {
  const { config, works, printFormats = [], shops = {}, sellOn = {} } = window.PATCHES;

  const money = (n) => (typeof n === "number" ? "$" + n.toLocaleString() : "Inquire");
  const customLink = (type, piece) =>
    "custom.html?type=" + encodeURIComponent(type) + (piece ? "&piece=" + encodeURIComponent(piece) : "");
  const formTypeFor = (w) => w.craft === "photography" ? "print"
    : ({ "Cutting Boards": "board", "Wands": "wand", "Tables & Benches": "woodworking" })[w.category] || "other";

  // Where a piece's main button goes: its shop (per sellOn rules), or the custom
  // order form when it's made to order or its shop isn't set up yet.
  function buyFor(w) {
    const form = customLink(formTypeFor(w), w.title);
    if (w.status === "commission") return { href: form, label: "Request something similar" };
    const channel = w.shop || sellOn[w.category] || sellOn[w.craft] || "custom";
    if (channel === "custom") return { href: form, label: "Request a quote" };
    const shop = shops[channel] || {};
    const url = w.link || shop.url;
    if (!url) return { href: form, label: w.status === "sold" ? "Ask about similar work" : "Inquire to buy" };
    return { href: url, external: true, label: (w.status === "sold" ? "See more on " : "Buy on ") + shop.name };
  }
  const priceLabel = (w) =>
    w.status === "sold" ? "Sold" : w.status === "commission" ? "Commissioned" : money(w.price);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // "Photo coming soon" tile, used until a piece has a real image.
  function placeholder(w) {
    const tint = w.craft === "photography" ? ["#d9dccf", "#6f7d5c"] : ["#e6d6c0", "#a06a3c"];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <rect width="400" height="400" fill="${tint[0]}"/>
      <g fill="none" stroke="${tint[1]}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 6">
        <rect x="20" y="20" width="360" height="360" rx="6"/></g>
      <text x="200" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="${tint[1]}">${esc(w.title)}</text>
      <text x="200" y="225" text-anchor="middle" font-family="sans-serif" font-size="14" letter-spacing="2" fill="${tint[1]}" fill-opacity=".7">PHOTO COMING SOON</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  const imageFor = (w) => w.image || placeholder(w);

  function card(w) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "card" + (w.status === "sold" ? " is-sold" : "");
    el.dataset.category = w.category || "";
    el.innerHTML = `
      <span class="card-img"><img src="${imageFor(w)}" alt="${esc(w.title)}" loading="lazy"></span>
      <span class="card-body">
        <span class="card-title">${esc(w.title)}</span>
        <span class="card-price">${priceLabel(w)}</span>
      </span>`;
    el.addEventListener("click", () => openDetail(w));
    return el;
  }

  // Fill every [data-gallery] on the page, with category filter buttons when there's more than one.
  document.querySelectorAll("[data-gallery]").forEach((grid) => {
    const which = grid.dataset.gallery;
    const list = which === "featured"
      ? works.filter((w) => w.featured)
      : works.filter((w) => w.craft === which);
    list.forEach((w) => grid.appendChild(card(w)));

    const cats = [...new Set(list.map((w) => w.category).filter(Boolean))];
    if (which === "featured" || cats.length < 2) return;
    const bar = document.createElement("div");
    bar.className = "filters";
    ["All", ...cats].forEach((c, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = c;
      b.setAttribute("aria-pressed", i === 0);
      b.addEventListener("click", () => {
        bar.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
        grid.querySelectorAll(".card").forEach((cardEl) => {
          cardEl.hidden = c !== "All" && cardEl.dataset.category !== c;
        });
      });
      bar.appendChild(b);
    });
    grid.before(bar);
  });

  // Print format cards with a small hanging diagram.
  const diagram = {
    single: '<i style="width:34%;height:44%"></i>',
    large: '<i style="width:70%;height:62%"></i>',
    triptych: '<i style="width:22%;height:60%"></i><i style="width:22%;height:60%"></i><i style="width:22%;height:60%"></i>',
    set: '<i style="width:22%;height:38%"></i><i style="width:22%;height:38%"></i><i style="width:22%;height:38%"></i>',
  };
  document.querySelectorAll("[data-formats]").forEach((wrap) => {
    wrap.innerHTML = printFormats.map((f) => `
      <div class="format">
        <div class="format-wall ${f.layout === "triptych" ? "is-split" : ""}">${diagram[f.layout] || diagram.single}</div>
        <h3>${esc(f.name)}</h3>
        <p class="format-sizes">${esc(f.sizes)}</p>
        <p>${esc(f.blurb)}</p>
        <p class="format-from">From ${money(f.from)}</p>
      </div>`).join("");
  });

  // Detail popup
  const dialog = document.getElementById("detail");
  function openDetail(w) {
    if (!dialog) return;
    const commission = w.status === "commission";
    const isPhoto = w.craft === "photography";
    dialog.querySelector(".d-img").src = imageFor(w);
    dialog.querySelector(".d-img").alt = w.title;
    dialog.querySelector(".d-craft").textContent = [w.craft, w.category].filter(Boolean).join(" · ");
    dialog.querySelector(".d-title").textContent = w.title;
    dialog.querySelector(".d-price").textContent = priceLabel(w);
    dialog.querySelector(".d-desc").textContent = w.description || "";
    dialog.querySelector(".d-details").innerHTML = (w.details || []).map((d) => `<li>${esc(d)}</li>`).join("");

    const formats = dialog.querySelector(".d-formats");
    formats.hidden = !isPhoto || !printFormats.length;
    formats.querySelector("ul").innerHTML = printFormats.map((f) => `<li>${esc(f.name)}</li>`).join("");

    const buy = dialog.querySelector(".d-buy");
    const ask = dialog.querySelector(".d-ask");
    const b = buyFor(w);
    buy.href = b.href;
    buy.textContent = b.label;
    if (b.external) { buy.target = "_blank"; buy.rel = "noopener"; } else buy.removeAttribute("target");
    // The second button only shows when the first one leaves the site; otherwise both would open the same form.
    ask.hidden = commission || !b.external;
    ask.href = customLink(formTypeFor(w), w.title);
    ask.textContent = isPhoto ? "Order in another format" : "Ask about a custom version";
    dialog.showModal();
  }
  if (dialog) {
    dialog.querySelector(".d-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  }

  // Custom order form: there's no server on GitHub Pages, so it opens the visitor's
  // email app with everything filled in.
  const form = document.getElementById("custom-form");
  if (form) {
    const params = new URLSearchParams(location.search);
    const typeSel = form.elements.type;
    const formatField = form.querySelector("[data-show-for]");
    const formatSel = form.elements.format;
    printFormats.forEach((f) => formatSel.add(new Option(`${f.name} (from ${money(f.from)})`, f.name)));
    if (params.get("type")) typeSel.value = params.get("type");
    if (params.get("piece")) form.elements.piece.value = params.get("piece");
    const syncFormat = () => (formatField.hidden = typeSel.value !== "print");
    typeSel.addEventListener("change", syncFormat);
    syncFormat();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements;
      const typeText = typeSel.options[typeSel.selectedIndex].text;
      const lines = [
        `Name: ${f.name.value}`,
        `Reply to: ${f.email.value}`,
        `Looking for: ${typeText}`,
        typeSel.value === "print" ? `Format: ${f.format.value}` : "",
        f.piece.value ? `Related piece: ${f.piece.value}` : "",
        f.budget.value ? `Budget: ${f.budget.value}` : "",
        f.timeline.value ? `Needed by: ${f.timeline.value}` : "",
        "",
        f.details.value,
      ].filter((l, i) => l || i === 7);
      const subject = `Custom order inquiry: ${typeText}`;
      location.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      form.querySelector(".form-note").hidden = false;
    });
  }

  // Shared links from config
  // Shop links: go to the shop once its url is set. Until then, use data-fallback
  // (with optional data-fallback-text) if given, or hide the link.
  document.querySelectorAll("[data-shop]").forEach((a) => {
    const shop = shops[a.dataset.shop];
    if (shop && shop.url) {
      a.href = shop.url;
      a.target = "_blank";
      a.rel = "noopener";
    } else if (a.dataset.fallback) {
      a.href = a.dataset.fallback;
      if (a.dataset.fallbackText) a.textContent = a.dataset.fallbackText;
    } else {
      a.remove();
    }
  });
  document.querySelectorAll("[data-shop-status]").forEach((s) => {
    const shop = shops[s.dataset.shopStatus];
    s.textContent = shop && shop.url ? "Sold on " + shop.name : "Shop coming soon";
  });
  document.querySelectorAll("[data-email]").forEach((a) => {
    a.href = "mailto:" + config.email;
    if (a.dataset.email === "show") a.textContent = config.email;
  });
  document.querySelectorAll("[data-instagram]").forEach((a) => {
    if (config.instagram) a.href = config.instagram; else a.remove();
  });
  document.querySelectorAll("[data-year]").forEach((s) => (s.textContent = new Date().getFullYear()));

  // Mobile menu
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) toggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));
})();
