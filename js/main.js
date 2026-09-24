/* main.js — boot order:
   1. video visibility / lazy loading (works without GSAP)
   2. page chrome: header, scroll progress, custom cursor
   3. motion system (skipped entirely when GSAP is unavailable) */

import { initVideoVisibility } from './video/visibility.js';
import {
  initHero,
  initManifesto,
  initChalk,
  initPrograms,
  initSprinter,
  initCoaches,
  initResults,
  initClosing,
  isReduced,
} from './motion/index.js';

/* ------------------------------------------------------------
   Page chrome
------------------------------------------------------------ */
function initChrome() {
  const header = document.querySelector('[data-header]');
  const bar = document.querySelector('[data-progress]');
  let ticking = false;
  let lastY = window.scrollY || document.documentElement.scrollTop;

  const update = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.classList.toggle('is-scrolled', y > 40);
      /* retreat while reading, return on the way up (never while menu open) */
      const menuOpen = document.body.classList.contains('nav-open');
      if (!menuOpen) {
        if (y > lastY + 4 && y > 320) header.classList.add('is-hidden');
        else if (y < lastY - 4 || y <= 320) header.classList.remove('is-hidden');
      }
    }
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

/* ------------------------------------------------------------
   Custom cursor — desktop only, never obstructs content
------------------------------------------------------------ */
function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const el = document.querySelector('[data-cursor]');
  if (!fine || !el) return;

  const label = el.querySelector('.cursor__label');
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;
  let started = false;

  const render = () => {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    window.requestAnimationFrame(render);
  };
  render();

  window.addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        started = true;
        el.classList.add('is-active');
      }

      const hit = e.target instanceof Element ? e.target.closest('[data-cursor-hover]') : null;
      if (hit) {
        const text = hit.getAttribute('data-cursor-label');
        el.classList.add('is-hover');
        label.textContent = text || '';
        label.style.display = text ? 'block' : 'none';
      } else {
        el.classList.remove('is-hover');
        label.textContent = '';
      }
    },
    { passive: true }
  );

  document.addEventListener('pointerleave', () => el.classList.remove('is-active'));
  document.addEventListener('pointerenter', () => started && el.classList.add('is-active'));
}

/* ------------------------------------------------------------
   Smooth scroll (Lenis, driven by GSAP's ticker so scroll-linked
   motion and smoothing share one clock). Skipped when reduced
   motion is preferred or the vendor file failed to load.
------------------------------------------------------------ */
let lenis = null;

function initSmoothScroll() {
  if (isReduced) return null;
  if (typeof window.Lenis === 'undefined') return null;

  lenis = new window.Lenis({
    duration: 1.15,
    smoothWheel: true,
    syncTouch: false,
  });
  window.__lenis = lenis;

  lenis.on('scroll', () => {
    if (typeof window.ScrollTrigger !== 'undefined') ScrollTrigger.update();
  });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/* ------------------------------------------------------------
   Mobile menu — CSS-driven overlay, staggered links, scroll locked
   while open (Lenis stops; body overflow is the no-Lenis fallback).
------------------------------------------------------------ */
function initMenu() {
  const btn = document.querySelector('[data-menu-btn]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!btn || !nav) return;

  const setOpen = (open) => {
    btn.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }
  };

  btn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  /* anchor handler scrolls; the menu just needs to get out of the way */
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      btn.focus();
    }
  });
}

/* Current-section indicator in the desktop nav. */
function initNavState() {
  if (typeof window.ScrollTrigger === 'undefined') return;
  const links = [...document.querySelectorAll('.header__nav a[href^="#"]')];
  if (!links.length) return;
  const setActive = (active) =>
    links.forEach((l) => l.classList.toggle('is-active', l === active));
  links.forEach((link) => {
    let target = null;
    try {
      target = document.querySelector(link.getAttribute('href'));
    } catch {
      return;
    }
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) setActive(link);
      },
    });
  });
}

/* Anchor jumps go through Lenis so pins are never fought mid-flight. */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    a.addEventListener('click', (e) => {
      let target = null;
      try {
        target = document.querySelector(id);
      } catch {
        return;
      }
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
}
function initMotion() {
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (!hasGsap) {
    /* No animation library: the static layout already reads correctly,
       but clipped/covering layers must not stay shut. */
    const chalk = document.querySelector('.scene__media-wrap--chalk');
    if (chalk) chalk.style.clipPath = 'inset(0 0 0 0)';
    document
      .querySelectorAll('[data-sprinter-veil], [data-coach-veil], [data-closing-veil]')
      .forEach((el) => {
        el.style.display = 'none';
      });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  /* mobile URL-bar resizes must not re-fire triggers mid-scroll */
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* smoothing first: every trigger below measures against the same clock */
  initSmoothScroll();

  initHero();
  initManifesto();
  initChalk();
  initPrograms();
  initSprinter();
  initCoaches();
  initResults();
  initClosing();

  /* Layout settles after fonts and metadata: recalculate triggers once. */
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh, { once: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh).catch(() => {});
  }

  /* Reduced motion: drop every trigger, keep the static composition. */
  if (isReduced) {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }

  initAnchors();
  if (!isReduced) initNavState();
}

/* ------------------------------------------------------------
   Boot
------------------------------------------------------------ */
initChrome();
initCursor();
initVideoVisibility();
/* menu first: its link handler must run before the anchor handler
   so Lenis is restarted before scrollTo is issued */
initMenu();
initMotion();
