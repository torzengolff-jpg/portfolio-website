/**
 * ════════════════════════════════════════════════════════════════
 * main.js — Portfolio Script · Production v3.0
 * PASTE THIS INTO: js/main.js
 * ════════════════════════════════════════════════════════════════
 */

'use strict';

/* ── 1. THEME (Dark / Light Mode) ────────────────────────────────
   - Reads localStorage first, then system preference
   - Applies data-theme="dark" or "light" to <html>
   - Wires up all .theme-toggle buttons
──────────────────────────────────────────────────────────────── */
const Theme = (() => {
  const KEY  = 'skc-theme';
  const root = document.documentElement;

  function get() {
    return localStorage.getItem(KEY)
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function init() {
    apply(get());

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      });
    });

    // Auto-update if system preference changes (and user hasn't set a preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(KEY)) apply(e.matches ? 'dark' : 'light');
    });
  }

  return { init };
})();


/* ── 2. SCROLL PROGRESS BAR ──────────────────────────────────────
   Fills the 2px line at the top as you scroll down the page
──────────────────────────────────────────────────────────────── */
const ScrollProgress = (() => {
  function init() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = max > 0 ? (window.scrollY / max * 100) + '%' : '0%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }
  return { init };
})();


/* ── 3. HEADER — scrolled shadow ─────────────────────────────────
   Adds .scrolled class to header when page is scrolled
──────────────────────────────────────────────────────────────── */
const Header = (() => {
  function init() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function check() {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  }
  return { init };
})();


/* ── 4. MOBILE NAV ───────────────────────────────────────────────
   Opens/closes the mobile drawer
   Closes on: link click · Escape key · outside click
──────────────────────────────────────────────────────────────── */
const MobileNav = (() => {
  let open = false;

  function set(state) {
    open = state;
    const toggle = document.querySelector('.nav-toggle');
    const nav    = document.querySelector('.mobile-nav');
    if (!toggle || !nav) return;

    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function init() {
    const toggle = document.querySelector('.nav-toggle');
    const nav    = document.querySelector('.mobile-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => set(!open));

    // Close when any nav link is clicked
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && open) set(false);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (open && !nav.contains(e.target) && !toggle.contains(e.target)) set(false);
    });
  }

  return { init };
})();


/* ── 5. SCROLL SPY ───────────────────────────────────────────────
   Highlights the correct nav link as you scroll through sections
──────────────────────────────────────────────────────────────── */
const ScrollSpy = (() => {
  function init() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const links    = document.querySelectorAll(
      '.site-nav a[href^="#"], .mobile-nav a[href^="#"]'
    );
    if (!sections.length || !links.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => obs.observe(s));
  }
  return { init };
})();


/* ── 6. SMOOTH SCROLL ────────────────────────────────────────────
   Scrolls to anchor targets, accounting for fixed header height
──────────────────────────────────────────────────────────────── */
const SmoothScroll = (() => {
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function(e) {
        const id = this.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const headerH = document.querySelector('.site-header')?.offsetHeight || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
  return { init };
})();


/* ── 7. SCROLL REVEAL ────────────────────────────────────────────
   Elements with class .reveal fade + slide up when scrolled into view
   Add data-delay="1" through "4" for staggered groups
──────────────────────────────────────────────────────────────── */
const Reveal = (() => {
  function init() {
    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
  }
  return { init };
})();


/* ── 8. ANIMATED COUNTERS ────────────────────────────────────────
   Elements: <span class="counter" data-target="340"></span>
   Animates from 0 to the target number when scrolled into view
──────────────────────────────────────────────────────────────── */
const Counters = (() => {
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animate(el, target, duration = 1600) {
    let start = null;
    const isFloat = target % 1 !== 0;

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const val = easeOutQuart(progress) * target;
      el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(1) : target;
    }
    requestAnimationFrame(step);
  }

  function init() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target, parseFloat(entry.target.getAttribute('data-target')));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => obs.observe(c));
  }
  return { init };
})();


/* ── 9. SKILL BAR ANIMATION ──────────────────────────────────────
   Elements: <div class="bar-fill" data-width="90"></div>
   Bar fills to the given width % when scrolled into view
──────────────────────────────────────────────────────────────── */
const SkillBars = (() => {
  function init() {
    const fills = document.querySelectorAll('.bar-fill[data-width]');
    if (!fills.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          setTimeout(() => {
            fill.style.width = fill.getAttribute('data-width') + '%';
          }, 200);
          obs.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(f => obs.observe(f));
  }
  return { init };
})();


/* ── 10. FLOATING CTA — hide/show on scroll ──────────────────────
   Hides when scrolling DOWN, reappears when scrolling UP or stopping
──────────────────────────────────────────────────────────────── */
const FloatingCTA = (() => {
  function init() {
    const el = document.querySelector('.floating-cta');
    if (!el) return;

    let lastY  = window.scrollY;
    let timer  = null;

    function show() {
      el.style.transform = '';
      el.style.opacity   = '1';
    }
    function hide() {
      el.style.transform = 'translateY(130%)';
      el.style.opacity   = '0';
    }

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > lastY && y > 300) hide(); else show();
      lastY = y;
      clearTimeout(timer);
      timer = setTimeout(show, 1500);
    }, { passive: true });
  }
  return { init };
})();


/* ── 11. CONTACT FORM ────────────────────────────────────────────
   Validates name / email / message
   POSTs to Formspree if <form action="..."> is set
   Falls back to mailto: if no action
──────────────────────────────────────────────────────────────── */
const ContactForm = (() => {
  function msg(form, type, text) {
    let el = form.querySelector('.form-feedback');
    if (!el) { el = document.createElement('p'); el.className = 'form-feedback'; form.appendChild(el); }
    el.textContent = text;
    el.style.cssText = `margin-top:.75rem;font-size:.875rem;font-weight:500;padding:10px 14px;border-radius:8px;border:1px solid;
      ${type === 'success'
        ? 'color:#16a34a;background:rgba(22,163,74,.1);border-color:rgba(22,163,74,.25)'
        : 'color:#C0553A;background:rgba(192,85,58,.1);border-color:rgba(192,85,58,.25)'}`;
    setTimeout(() => el?.remove(), 5000);
  }

  function validate(d) {
    if (!d.name.trim())  return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Please enter a valid email.';
    if (d.message.trim().length < 10) return 'Message must be at least 10 characters.';
    return null;
  }

  function init() {
    const form = document.querySelector('.contact-form, #contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const d = {
        name:    this.querySelector('[name="name"]')?.value    || '',
        email:   this.querySelector('[name="email"]')?.value   || '',
        message: this.querySelector('[name="message"]')?.value || '',
      };

      const err = validate(d);
      if (err) { msg(this, 'error', err); return; }

      const btn = this.querySelector('[type="submit"]');
      const orig = btn?.textContent;
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      try {
        if (this.action && this.action !== window.location.href) {
          const res = await fetch(this.action, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(d),
          });
          if (res.ok) { msg(this, 'success', '✓ Sent! I'll reply within 24 hours.'); this.reset(); }
          else throw new Error();
        } else {
          window.open(`mailto:surajkrchandravanshi@gmail.com?subject=Portfolio%20Enquiry&body=${encodeURIComponent(d.message)}`);
          msg(this, 'success', '✓ Opening your mail client…'); this.reset();
        }
      } catch {
        msg(this, 'error', 'Something went wrong. Please email me directly.');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = orig; }
      }
    });
  }
  return { init };
})();


/* ── 12. COPY EMAIL ──────────────────────────────────────────────
   Silently copies email to clipboard when mailto links are clicked
──────────────────────────────────────────────────────────────── */
const CopyEmail = (() => {
  function init() {
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.addEventListener('click', function() {
        const email = this.href.replace('mailto:', '').split('?')[0];
        navigator.clipboard?.writeText(email).catch(() => {});
      });
    });
  }
  return { init };
})();


/* ── 13. MINI CHARTS ─────────────────────────────────────────────
   Usage in HTML: <div class="mini-chart" data-values="20,40,65,80,95,100"></div>
   Draws proportional bar columns automatically
──────────────────────────────────────────────────────────────── */
const MiniCharts = (() => {
  function init() {
    document.querySelectorAll('.mini-chart[data-values]').forEach(chart => {
      const values = chart.getAttribute('data-values').split(',').map(Number);
      const max    = Math.max(...values);
      chart.innerHTML = '';
      values.forEach(v => {
        const bar = document.createElement('div');
        bar.className   = 'mini-chart-bar';
        bar.style.height = (v / max * 100) + '%';
        bar.title        = v + '%';
        chart.appendChild(bar);
      });
    });
  }
  return { init };
})();


/* ── PAGE LOAD ───────────────────────────────────────────────────
   Adds .loaded to <html> when all resources are ready
──────────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  document.documentElement.classList.add('loaded');
});


/* ════════════════════════════════════════════════════════════════
   INITIALISE EVERYTHING
   Runs after the HTML is fully parsed
════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  ScrollProgress.init();
  Header.init();
  MobileNav.init();
  ScrollSpy.init();
  SmoothScroll.init();
  Reveal.init();
  Counters.init();
  SkillBars.init();
  FloatingCTA.init();
  ContactForm.init();
  CopyEmail.init();
  MiniCharts.init();
});
