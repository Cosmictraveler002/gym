/* results.js — information-led motion, visual recovery.
   No third cinematic sequence: only numbers, opacity and small travel. */

import { maskedTextReveal, fadeRise, isReduced } from './primitives.js';

function format(value, suffix) {
  return Math.round(value).toLocaleString('en-US') + suffix;
}

export function initResults() {
  const section = document.querySelector('[data-section="results"]');
  if (!section) return;

  if (isReduced) {
    section.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = format(Number(el.dataset.count), el.dataset.suffix || '');
    });
    return;
  }

  const head = section.querySelector('.results__head');

  maskedTextReveal(gsap.utils.toArray('.line[data-result-fade]'), {
    trigger: head,
    start: 'top 80%',
    duration: 1.2,
    stagger: 0.12,
  });

  fadeRise(gsap.utils.toArray('[data-result-fade]:not(.line)'), {
    trigger: section,
    start: 'top 70%',
    delay: 0.3,
    y: 24,
    stagger: 0.12,
  });

  const stats = gsap.utils.toArray('[data-stat]');

  gsap.fromTo(
    stats,
    { opacity: 0, y: 34 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: section.querySelector('.stats'), start: 'top 82%', once: true },
    }
  );

  /* numbers appear sequentially, each one earned */
  section.querySelectorAll('[data-count]').forEach((el, i) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const counter = { value: 0 };

    el.textContent = format(0, suffix);

    gsap.to(counter, {
      value: target,
      duration: 1.7,
      delay: 0.2 + i * 0.12,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = format(counter.value, suffix);
      },
      scrollTrigger: { trigger: section.querySelector('.stats'), start: 'top 82%', once: true },
    });
  });
}
