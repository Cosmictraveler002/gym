/* manifesto.js — visual pause. No video, one sentence, masked reveal.
   Nothing else: the eye resets before the chalk interaction. */

import { maskedTextReveal, fadeRise, isReduced } from './primitives.js';

export function initManifesto() {
  const section = document.querySelector('[data-section="manifesto"]');
  if (!section || isReduced) return;

  const lines = gsap.utils.toArray('[data-manifesto-text] .line');
  const fades = gsap.utils.toArray('[data-manifesto-fade]');

  maskedTextReveal(lines, {
    trigger: section,
    start: 'top 68%',
    duration: 1.2,
    stagger: 0.12,
  });

  fadeRise(fades, {
    trigger: section,
    start: 'top 60%',
    delay: 0.5,
    y: 24,
    stagger: 0.12,
  });
}
