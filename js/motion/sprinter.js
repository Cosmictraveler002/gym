/* sprinter.js — SIGNATURE SEQUENCE #2.
   The camera already travels laterally; the page only changes the
   composition around it. The footage rests full-size BEHIND a
   page-coloured veil that retracts upward — the frame opens in ONE
   direction only — while the media breathes 90% → 100% by midway and
   settles back as the section exits. currentTime is never scrubbed.

   Built from primitives: pinSequence (one ScrollTrigger) + scaleMedia
   + parallaxLayer + late text. */

import { pinSequence, scaleMedia, parallaxLayer, isReduced } from './primitives.js';

export function initSprinter() {
  const section = document.querySelector('[data-section="sprinter"]');
  if (!section) return;

  const pin = section.querySelector('[data-sprinter-pin]');
  const media = section.querySelector('[data-sprinter-media]');
  const veil = section.querySelector('[data-sprinter-veil]');
  const scaler = section.querySelector('[data-sprinter-scale]');
  const video = media ? media.querySelector('video') : null;
  const bg = section.querySelector('[data-sprinter-bg]');
  const texts = gsap.utils.toArray('[data-sprinter-text]');
  const target = scaler || video || media;

  if (isReduced) {
    if (target) target.style.transform = 'none';
    if (veil) veil.style.display = 'none';
    gsap.set(texts, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(texts, { opacity: 0, y: 40 });

  const mm = gsap.matchMedia();

  /* ---------- desktop: one-direction veil reveal + scale arc ---------- */
  mm.add('(min-width: 861px)', () => {
    const tl = pinSequence(pin, { end: '+=180%', scrub: 1 });
    if (!tl) return;

    /* the page layer retracts upward, uncovering the footage bottom-up */
    if (veil) {
      tl.fromTo(
        veil,
        { clipPath: 'inset(0% 0 0% 0)' },
        { clipPath: 'inset(0% 0 100% 0)', ease: 'power2.out', duration: 0.5 },
        0
      );
    }
    if (target) {
      /* 90% → 100% by midway… */
      scaleMedia(target, 0.9, 1, { tl, duration: 0.5 });
      /* …then a controlled scale-down as the section exits */
      tl.to(target, { scale: 0.94, ease: 'none', duration: 0.5 }, 0.5);
    }
    /* background drifts at a different rate — depth, not decoration */
    if (bg) parallaxLayer(bg, 5, -5, { tl, duration: 1 });
    /* text waits until the momentum of the shot is established */
    tl.to(texts, { opacity: 1, y: 0, duration: 0.28, stagger: 0.05, ease: 'none' }, 0.42);
  });

  /* ---------- tablet / mobile: same idea, no pin ---------- */
  mm.add('(max-width: 860px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 20%',
        scrub: 0.9,
        invalidateOnRefresh: true,
      },
    });

    if (veil) {
      tl.fromTo(
        veil,
        { clipPath: 'inset(0% 0 0% 0)' },
        { clipPath: 'inset(0% 0 100% 0)', ease: 'power2.out', duration: 0.55 },
        0
      );
    }
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
