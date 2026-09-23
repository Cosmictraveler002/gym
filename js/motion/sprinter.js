/* sprinter.js — SIGNATURE SEQUENCE #2.
   The camera already travels laterally; the page only changes the
   composition around it: scale 1.12 -> 1.00 while the section is pinned.
   currentTime is never scrubbed.

   Built from primitives: pinSequence (one ScrollTrigger) + scaleMedia
   + parallaxLayer + late text. */

import { pinSequence, revealY, scaleMedia, parallaxLayer, isReduced } from './primitives.js';

export function initSprinter() {
  const section = document.querySelector('[data-section="sprinter"]');
  if (!section) return;

  const pin = section.querySelector('[data-sprinter-pin]');
  const media = section.querySelector('[data-sprinter-media]');
  const video = media ? media.querySelector('video') : null;
  const bg = section.querySelector('[data-sprinter-bg]');
  const texts = gsap.utils.toArray('[data-sprinter-text]');
  const target = video || media;

  if (isReduced) {
    if (target) target.style.transform = 'none';
    gsap.set(texts, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(texts, { opacity: 0, y: 40 });

  const mm = gsap.matchMedia();

  /* ---------- desktop: pinned Y-reveal + scale arc + parallax ---------- */
  mm.add('(min-width: 861px)', () => {
    const tl = pinSequence(pin, { end: '+=180%', scrub: 0.9 });
    if (!tl) return;

    /* the clipped background media reveals itself along the Y axis */
    revealY(media, { tl, from: 'inset(18% 0 18% 0)', to: 'inset(0% 0 0% 0)', duration: 0.5 });
    if (target) {
      /* 90% → 100% by midway… */
      scaleMedia(target, 0.9, 1, { tl, duration: 0.5 });
      /* …then a controlled scale-down as the section exits */
      tl.to(target, { scale: 0.94, ease: 'none', duration: 0.5 }, 0.5);
    }
    /* background drifts at a different rate — depth, not decoration */
    if (bg) parallaxLayer(bg, 5, -5, { tl, duration: 1 });
    /* text waits until the momentum of the shot is established */
    tl.to(texts, { opacity: 1, y: 0, duration: 0.28, stagger: 0.05, ease: 'power2.out' }, 0.42);
  });

  /* ---------- tablet / mobile: same idea, no pin ---------- */
  mm.add('(max-width: 860px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 20%',
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    if (target) scaleMedia(target, 1.07, 1, { tl, duration: 1 });

    gsap.to(texts, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 50%', once: true },
    });
  });
}
