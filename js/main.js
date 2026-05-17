/* ================================================================
   MAIN.JS — Portfolio Interactions
   Suraj Kumar Chandravanshi
   ================================================================ */

'use strict';

/* ── SCROLL PROGRESS ─────────────────────────────────────────── */
const initScrollProgress = () => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  };

  window.addEventListener('scroll', update, { passive: true });
};

/* ── HEADER SCROLL STATE ──────────────────────────────────────── */
const initHeader = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const toggle = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
};

/* ── MOBILE NAV ───────────────────────────────────────────────── */
const initMobileNav = () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!header?.contains(e.target) && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  const header = document.querySelector('.site-header');
};

/* ── ACTIVE NAV LINK ──────────────────────────────────────────── */
const initActiveNav = () => {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
};

/* ── REVEAL ON SCROLL ─────────────────────────────────────────── */
const initReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  items.forEach(el => observer.observe(el));
};

/* ── SKILL BARS ANIMATION ─────────────────────────────────────── */
const initSkillBars = () => {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = bar.dataset.pct || '0';
          bar.style.width = `${target}%`;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
};

/* ── COUNTER ANIMATION ────────────────────────────────────────── */
const initCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el, start, end, duration, suffix) => {
    const range = end - start;
    let startTime = null;

    const step = timestamp => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + range * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const end = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          animate(el, 0, end, 1400, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
};

/* ── SMOOTH SCROLL ────────────────────────────────────────────── */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h'), 10) || 68;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - headerH - 8,
        behavior: 'smooth',
      });
    });
  });
};

/* ── CONTACT FORM ─────────────────────────────────────────────── */
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate — replace with real endpoint
    setTimeout(() => {
      btn.textContent = 'Sent ✓';
      btn.style.background = 'var(--teal)';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }, 1200);
  });
};

/* ── INIT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeader();
  initMobileNav();
  initActiveNav();
  initReveal();
  initSkillBars();
  initCounters();
  initSmoothScroll();
  initContactForm();
});
