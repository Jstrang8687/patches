// Renders galleries and the piece detail popup from works.js.
(function () {
  const { config, works } = window.PATCHES;

  const money = (n) => (typeof n === "number" ? "$" + n.toLocaleString() : "Inquire");
  const linkFor = (w) => w.etsy || config.etsyShop;

  function card(w) {
    const sold = w.status === "sold";
    const el = document.createElement("button");
    el.type = "button";
    el.className = "card" + (sold ? " is-sold" : "");
    el.innerHTML = `
      <span class="card-img"><img src="${w.image}" alt="${w.title}" loading="lazy"></span>
      <span class="card-body">
        <span class="card-title">${w.title}</span>
        <span class="card-price">${sold ? "Sold" : money(w.price)}</span>
      </span>`;
    el.addEventListener("click", () => openDetail(w));
    return el;
  }

  // Fill every [data-gallery] on the page.
  document.querySelectorAll("[data-gallery]").forEach((grid) => {
    const which = grid.dataset.gallery;
    const list = which === "featured"
      ? works.filter((w) => w.featured)
      : works.filter((w) => w.craft === which);
    list.forEach((w) => grid.appendChild(card(w)));
  });

  // Detail popup
  const dialog = document.getElementById("detail");
  function openDetail(w) {
    if (!dialog) return;
    const sold = w.status === "sold";
    dialog.querySelector(".d-img").src = w.image;
    dialog.querySelector(".d-img").alt = w.title;
    dialog.querySelector(".d-craft").textContent = w.craft;
    dialog.querySelector(".d-title").textContent = w.title;
    dialog.querySelector(".d-price").textContent = sold ? "Sold" : money(w.price);
    dialog.querySelector(".d-desc").textContent = w.description || "";
    dialog.querySelector(".d-details").innerHTML = (w.details || []).map((d) => `<li>${d}</li>`).join("");
    const buy = dialog.querySelector(".d-buy");
    buy.href = linkFor(w);
    buy.textContent = sold ? "See similar work on Etsy" : "View on Etsy";
    const ask = dialog.querySelector(".d-ask");
    ask.href = `mailto:${config.email}?subject=${encodeURIComponent("Question about " + w.title)}`;
    dialog.showModal();
  }
  if (dialog) {
    dialog.querySelector(".d-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  }

  // Shared links from config
  document.querySelectorAll("[data-etsy]").forEach((a) => (a.href = config.etsyShop));
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
