/* primitives.js — the reusable GSAP/ScrollTrigger motion library.
   One idea per call site; small travel; never compete with the footage.

   Every scrub primitive (revealY / scaleMedia / parallaxLayer) can either
   join a shared pin timeline — preferred: exactly ONE ScrollTrigger per
   section — or run standalone with its own trigger.                    */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isReduced = REDUCED;

/**
 * pinSequence — temporarily hold a cinematic scene while scroll drives the
 * returned timeline. Reserved for the two signature sequences only.
 * Returns null when motion is reduced.
 */
export function pinSequence(trigger, { start = 'top top', end = '+=200%', scrub = 0.8, anticipate = 1 } = {}) {
  if (REDUCED) return null;
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      pin: true,
      pinSpacing: true,
      anticipatePin: anticipate,
      invalidateOnRefresh: true,
    },
  });
}

/**
 * revealY — open a media element along the Y axis by expanding the
 * wrapper's visible region (clip-path inset). The wrapper carries the
 * clip; the video itself never moves. Pass `tl` to join a pin timeline.
 */
export function revealY(
  wrap,
  { from = 'inset(18% 0 18% 0)', to = 'inset(0% 0 0% 0)', duration = 0.55, at = 0, tl = null, trigger, start, end, scrub = true } = {}
) {
  if (REDUCED) {
    gsap.set(wrap, { clipPath: to });
    return null;
  }
  gsap.set(wrap, { clipPath: from });

  if (tl) return tl.to(wrap, { clipPath: to, ease: 'none', duration }, at);

  return gsap.to(wrap, {
    clipPath: to,
    ease: 'none',
    duration,
    scrollTrigger: { trigger, start, end, scrub, invalidateOnRefresh: true },
  });
}

/**
 * scaleMedia — control visual scale without touching layout.
 * Typical ranges: 0.94 -> 1.00 | 1.12 -> 1.00 | 1.00 -> 1.025
 * Pass `tl` to join a pin timeline.
 */
export function scaleMedia(
  target,
  from,
  to,
  { duration = 0.6, at = 0, tl = null, trigger, start, end, scrub = true } = {}
) {
  if (REDUCED) {
    gsap.set(target, { scale: 1 });
    return null;
  }
  gsap.set(target, { scale: from });

  if (tl) return tl.to(target, { scale: to, ease: 'none', duration }, at);

  return gsap.to(target, {
    scale: to,
    ease: 'none',
    duration,
    scrollTrigger: { trigger, start, end, scrub, invalidateOnRefresh: true },
  });
}

/**
 * parallaxLayer — move layers at different rates so depth reads.
 * `fromY -> toY` are yPercent values; never give every layer the same
 * value. Pass `tl` to join a pin timeline.
 */
export function parallaxLayer(
  target,
  fromY,
  toY,
  { duration = 1, at = 0, tl = null, trigger, start = 'top bottom', end = 'bottom top', scrub = true } = {}
) {
  if (REDUCED) return null;

  if (tl) return tl.fromTo(target, { yPercent: fromY }, { yPercent: toY, ease: 'none', duration }, at);

  return gsap.fromTo(
    target,
    { yPercent: fromY },
    { yPercent: toY, ease: 'none', duration, scrollTrigger: { trigger, start, end, scrub } }
  );
}

/**
 * fadeRise — restrained upward movement + opacity.
 * For labels, supporting copy, CTAs.
 * immediate defaults to TRUE so the hidden state is applied at creation —
 * otherwise an element is visible first and pops to 0 when its trigger
 * fires mid-scroll.
 */
export function fadeRise(targets, { trigger, start = 'top 85%', delay = 0, duration = 1, y = 24, stagger = 0.08, immediate = true } = {}) {
  if (REDUCED) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return null;
  }
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      immediateRender: immediate,
      scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
    }
  );
}

/**
 * maskedTextReveal — typography rises out of a clipped region.
 * For the manifesto, philosophy and major section titles.
 */
export function maskedTextReveal(lines, { trigger, start = 'top 80%', delay = 0, duration = 1.1, yPercent = 110, stagger = 0.12, immediate = true } = {}) {
  if (REDUCED) {
    gsap.set(lines, { yPercent: 0, opacity: 1 });
    return null;
  }
  return gsap.fromTo(
    lines,
    { yPercent, opacity: 1 },
    {
      yPercent: 0,
      duration,
      delay,
      stagger,
      ease: 'power4.out',
      immediateRender: immediate,
      scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
    }
  );
}

/**
 * sectionExit — coordinate typography/media leaving the viewport.
 * Restrained: opacity + small travel, never a hard cut.
 */
export function sectionExit(targets, { trigger, start = 'top top', end = 'bottom top', y = -40, opacity = 0.85, scaleTo } = {}) {
  if (REDUCED) return null;
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start, end, scrub: true },
  });
  tl.to(targets, { y, opacity, ease: 'none' }, 0);
  if (scaleTo != null) tl.to(trigger, { scale: scaleTo, ease: 'none' }, 0);
  return tl;
}
