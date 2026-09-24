/* programs.js — editorial cards, natural playback, no pinning.
   Small Y entrance, scale 0.98 -> 1.00. Hover lives in CSS. */

import { maskedTextReveal, fadeRise, isReduced } from './primitives.js';

export function initPrograms() {
  const section = document.querySelector('[data-section="programs"]');
  if (!section || isReduced) return;

  const lines = gsap.utils.toArray(
    '[data-program-reveal].line, .line[data-program-reveal]'
  );
  const head = section.querySelector('.programs__head');
  const cards = gsap.utils.toArray('[data-program-card]');

  if (lines.length) {
    maskedTextReveal(lines, {
      trigger: head,
      start: 'top 78%',
      duration: 1.2,
      stagger: 0.12,
    });
  }

  fadeRise(gsap.utils.toArray('[data-program-reveal]:not(.line)'), {
    trigger: head,
    start: 'top 75%',
    delay: 0.25,
    y: 24,
    stagger: 0.12,
  });

  /* cards ride the scroll upward — one scrubbed timeline, the second
     card trailing the first by a slight stagger */
  const grid = section.querySelector('.programs__grid');
  const cardsTl = gsap.timeline({
    scrollTrigger: {
      trigger: grid,
      start: 'top 85%',
      end: 'top 35%',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  cardsTl.fromTo(
    cards,
    { y: 140, opacity: 0, scale: 0.98 },
    { y: 0, opacity: 1, scale: 1, ease: 'none', duration: 0.6, stagger: 0.18 }
  );
}
