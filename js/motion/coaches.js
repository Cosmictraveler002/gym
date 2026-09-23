/* coaches.js — "editorial portrait photography that happens to be alive."
   Card entrance, portrait crop, natural loop, subtle hover (CSS only). */

import { maskedTextReveal, fadeRise, revealY, parallaxLayer, isReduced } from './primitives.js';

export function initCoaches() {
  const section = document.querySelector('[data-section="coaches"]');
  if (!section || isReduced) return;

  const lines = gsap.utils.toArray('.line[data-coach-text]');
  const copy = section.querySelector('.coaches__copy');
  const media = section.querySelector('[data-coach-media]');
  const roster = gsap.utils.toArray('[data-coach-roster]');

  maskedTextReveal(lines, {
    trigger: copy,
    start: 'top 78%',
    duration: 1.1,
    stagger: 0.1,
  });

  fadeRise(gsap.utils.toArray('[data-coach-text]:not(.line)'), {
    trigger: copy,
    start: 'top 74%',
    delay: 0.25,
    y: 22,
    stagger: 0.14,
  });

  /* one scrubbed arrival: the portrait uncovers along the Y axis while
     portrait and copy travel at different rates — the page itself
     parallaxes into place */
  const arrival = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 90%',
      end: 'center 35%',
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  });

  revealY(media, { tl: arrival, from: 'inset(30% 0 30% 0)', to: 'inset(0 0 0 0)', duration: 0.45 });
  parallaxLayer(media, 8, -4, { tl: arrival, duration: 1 });
  parallaxLayer(copy, -6, 6, { tl: arrival, duration: 1 });

  gsap.fromTo(
    roster,
    { opacity: 0, y: 22 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: roster[0], start: 'top 88%', once: true },
    }
  );
}
