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

  const update = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
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
   Motion system
------------------------------------------------------------ */
function initMotion() {
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (!hasGsap) {
    /* No animation library: the static layout already reads correctly,
       but the chalk wrapper must not stay clipped. */
    const chalk = document.querySelector('.scene__media-wrap--chalk');
    if (chalk) chalk.style.clipPath = 'inset(0 0 0 0)';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

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
}

/* ------------------------------------------------------------
   Boot
------------------------------------------------------------ */
initChrome();
initCursor();
initVideoVisibility();
initMotion();
