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
      duration: 1.05,
      stagger: 0.1,
    });
  }

  fadeRise(gsap.utils.toArray('[data-program-reveal]:not(.line)'), {
    trigger: head,
    start: 'top 75%',
    delay: 0.25,
    y: 22,
    stagger: 0.15,
  });

  gsap.fromTo(
    cards,
    { opacity: 0, y: 70, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      /* ½ second between cards — ScrollTrigger-controlled entrance */
      stagger: 0.5,
      ease: 'power3.out',
      scrollTrigger: { trigger: section.querySelector('.programs__grid'), start: 'top 78%', once: true },
    }
  );
}
