/* chalk.js — SIGNATURE SEQUENCE #1.
   The footage enters from the BOTTOM: the window opens upward off the
   bottom edge while the panel rises along the Y axis and grows 30%→100%
   out of the bottom-LEFT corner — one diagonal move, eased smooth —
   and only then the message appears in the negative space. */

import { pinSequence, revealY, scaleMedia, parallaxLayer, isReduced } from './primitives.js';

export function initChalk() {
  const section = document.querySelector('[data-section="chalk"]');
  if (!section) return;

  const pin = section.querySelector('[data-chalk-pin]');
  const clip = section.querySelector('[data-chalk-clip]');
  const scale = section.querySelector('[data-chalk-scale]');
  const bg = section.querySelector('[data-chalk-bg]');
  const lines = gsap.utils.toArray('[data-chalk-text].line');
  const fades = gsap.utils.toArray('[data-chalk-text]:not(.line)');

  if (isReduced) {
    if (clip) clip.style.clipPath = 'inset(0 0 0 0)';
    gsap.set(lines, { yPercent: 0, opacity: 1 });
    gsap.set(fades, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(lines, { yPercent: 110 });
  gsap.set(fades, { opacity: 0, y: 24 });
  /* diagonal growth needs the corner pinned before the timeline runs */
  if (scale) gsap.set(scale, { transformOrigin: '0% 100%', yPercent: 12 });

  const mm = gsap.matchMedia();

  /* ---------- desktop: pinned choreography, one ScrollTrigger ---------- */
  mm.add('(min-width: 861px)', () => {
    const tl = pinSequence(pin, { end: '+=170%', scrub: 1 });
    if (!tl) return;

    /* the window opens upward from the bottom edge */
    revealY(clip, { tl, from: 'inset(60% 0 0% 0)', to: 'inset(0% 0 0% 0)', duration: 0.4 });
    /* the backdrop travels hard against the reveal — the dynamic parallax */
    if (bg) parallaxLayer(bg, 16, -16, { tl, duration: 1, at: 0 });
    if (scale) {
      /* rise along Y while growing out of the bottom-left corner */
      tl.to(scale, { yPercent: 0, ease: 'power2.out', duration: 0.62 }, 0);
      scaleMedia(scale, 0.3, 1, { tl, duration: 0.5, at: 0.12, ease: 'power2.out' });
    }
    /* late: the message arrives after the frame is full */
    tl.to(lines, { yPercent: 0, duration: 0.26, stagger: 0.07, ease: 'none' }, 0.72);
    tl.to(fades, { opacity: 1, y: 0, duration: 0.2, stagger: 0.07, ease: 'none' }, 0.78);
  });

  /* ---------- mobile: same idea, no pin ---------- */
  mm.add('(max-width: 860px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 92%',
        end: 'top 8%',
        scrub: 0.9,
        invalidateOnRefresh: true,
      },
    });

    revealY(clip, { tl, from: 'inset(60% 0 0% 0)', to: 'inset(0% 0 0% 0)', duration: 0.45 });
    if (bg) parallaxLayer(bg, 16, -16, { tl, duration: 1, at: 0 });
    if (scale) {
      tl.to(scale, { yPercent: 0, ease: 'power2.out', duration: 0.7 }, 0);
      scaleMedia(scale, 0.3, 1, { tl, duration: 0.5, at: 0.2, ease: 'power2.out' });
    }

    /* the frame is full before the message lands */
    gsap.to(lines, {
      yPercent: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: { trigger: section, start: 'top 30%', once: true },
    });
    gsap.to(fades, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 26%', once: true },
    });
  });
}
