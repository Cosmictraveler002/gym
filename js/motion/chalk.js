/* chalk.js — SIGNATURE SEQUENCE #1.
   The exact choreography the manifesto carried, now living here:
   the window opens along the Y axis while the backdrop travels hard
   against it; the footage arrives as a 30%-scale panel at the LEFT
   corner, floats upward while it grows to full frame — and only then
   the message appears in the negative space. */

import { pinSequence, revealY, scaleMedia, parallaxLayer, isReduced } from './primitives.js';

export function initChalk() {
  const section = document.querySelector('[data-section="chalk"]');
  if (!section) return;

  const pin = section.querySelector('[data-chalk-pin]');
  const clip = section.querySelector('[data-chalk-clip]');
  const video = clip ? clip.querySelector('video') : null;
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

  const mm = gsap.matchMedia();

  /* ---------- desktop: pinned choreography, one ScrollTrigger ---------- */
  mm.add('(min-width: 861px)', () => {
    const tl = pinSequence(pin, { end: '+=170%', scrub: 0.85 });
    if (!tl) return;

    /* 0–36%: the window opens along the Y axis */
    revealY(clip, { tl, from: 'inset(30% 0 30% 0)', to: 'inset(0 0 0 0)', duration: 0.4 });
    /* the backdrop travels hard against the reveal — the dynamic parallax */
    if (bg) parallaxLayer(bg, 16, -16, { tl, duration: 1, at: 0 });
    /* the panel floats upward as it grows, settling before the type */
    if (video) parallaxLayer(video, 4, 0, { tl, duration: 0.72, at: 0 });
    /* 14–54%: the 30%-scale left panel grows to full frame */
    if (video) scaleMedia(video, 0.3, 1, { tl, duration: 0.44, at: 0.16 });
    /* late: the message arrives, layers at different rates */
    tl.to(lines, { yPercent: 0, duration: 0.26, stagger: 0.07, ease: 'power4.out' }, 0.72);
    tl.to(fades, { opacity: 1, y: 0, duration: 0.2, stagger: 0.07, ease: 'power2.out' }, 0.78);
  });

  /* ---------- mobile: same idea, no pin ---------- */
  mm.add('(max-width: 860px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 92%',
        end: 'top 8%',
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    revealY(clip, { tl, from: 'inset(30% 0 30% 0)', to: 'inset(0 0 0 0)', duration: 0.45 });
    if (bg) parallaxLayer(bg, 16, -16, { tl, duration: 1, at: 0 });
    if (video) parallaxLayer(video, 4, 0, { tl, duration: 0.72, at: 0 });
    if (video) scaleMedia(video, 0.3, 1, { tl, duration: 0.5, at: 0.2 });

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
