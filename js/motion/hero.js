/* hero.js — natural playback, restrained entrance, restrained exit.
   Plan §10/§28: a SHORT pin establishes the opening composition, then
   one quiet exit move — media scale 1.000 -> 1.025 (on the VIDEO, not
   the wrapper, so scrims stay anchored), headline drift, opacity
   1 -> 0.85. No video-time scrub, no complex parallax. */

import { maskedTextReveal, fadeRise, isReduced } from './primitives.js';

export function initHero() {
  const section = document.querySelector('[data-section="hero"]');
  if (!section || isReduced) return;

  const lines = gsap.utils.toArray('.line[data-hero-line]');
  const rises = gsap.utils.toArray('[data-hero-line]:not(.line)');
  const wrap = section.querySelector('[data-hero-media]');
  const media = (wrap && wrap.querySelector('video')) || wrap;
  const content = section.querySelector('[data-hero-content]');

  /* --- entrance: title system settles into place --- */
  maskedTextReveal(lines, { duration: 1.2, delay: 0.3, stagger: 0.12 });
  fadeRise(rises, { delay: 0.55, duration: 1, stagger: 0.12, y: 24 });

  /* --- scroll exit: short pin holds the composition, one quiet move --- */
  const exit = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=55%',
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  exit
    .to(media, { scale: 1.025, ease: 'none' }, 0)
    .to(content, { y: -70, opacity: 0.85, ease: 'none' }, 0);
}
