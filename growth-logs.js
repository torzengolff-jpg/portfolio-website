/* ================================================================
   GROWTH LOGS — Interactive JS
   Handles: search, filters, scroll reveal, newsletter form
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ── REVEAL ON SCROLL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".gl-reveal");
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el) => revealObs.observe(el));

  /* ── SEARCH + FILTER ───────────────────────────────────────── */
  const searchInput = document.getElementById("gl-search");
  const filterBtns  = document.querySelectorAll(".gl-filter");
  const cards       = document.querySelectorAll("#gl-grid .gl-card");
  const emptyState  = document.getElementById("gl-empty");
  const countBadge  = document.getElementById("gl-count");

  let activeFilter = "all";
  let searchQuery  = "";

  function filterCards() {
    let visible = 0;
    cards.forEach((card) => {
      const category = card.getAttribute("data-category") || "";
      const title    = (card.getAttribute("data-title") || card.querySelector(".gl-card__title")?.textContent || "").toLowerCase();
      const desc     = (card.querySelector(".gl-card__desc")?.textContent || "").toLowerCase();

      const matchFilter = activeFilter === "all" || category === activeFilter;
      const matchSearch = searchQuery === "" || title.includes(searchQuery) || desc.includes(searchQuery);

      const show = matchFilter && matchSearch;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    if (emptyState) emptyState.hidden = visible > 0;
    if (countBadge) countBadge.textContent = visible + (visible === 1 ? " article" : " articles");
  }

  /* Filter buttons */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      activeFilter = btn.getAttribute("data-filter");
      filterCards();
    });
  });

  /* Search input */
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      filterCards();
    });
  }

  /* ── NEWSLETTER FORM ───────────────────────────────────────── */
  const form = document.getElementById("gl-form");
  const formNote = document.getElementById("gl-form-note");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("input[type='email']")?.value;
      if (!email) return;

      const btn = form.querySelector("button");
      if (btn) {
        btn.textContent = "Subscribed ✓";
        btn.disabled = true;
        btn.style.opacity = "0.75";
      }
      if (formNote) {
        formNote.textContent = "You're in! Expect your first email soon.";
        formNote.style.color = "rgba(255,255,255,0.85)";
      }
      form.querySelector("input").disabled = true;
    });
  }

  /* ── SCROLL PROGRESS BAR ───────────────────────────────────── */
  const bar = document.getElementById("scrollProgress") || document.querySelector(".gl-reading-progress");
  if (bar) {
    window.addEventListener("scroll", () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width  = pct + "%";
    }, { passive: true });
  }

  /* ── KEYBOARD SHORTCUT: ⌘K / Ctrl+K focuses search ─────────── */
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      searchInput?.focus();
    }
  });

});
