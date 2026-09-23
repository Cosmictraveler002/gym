/* closing.js — the source's slow zoom-out stays the dominant movement.
   The site only handles typography: title, CTA, recession, footer.
   Quiet ending, not an explosion. */

import { maskedTextReveal, fadeRise, revealY, isReduced } from './primitives.js';

export function initClosing() {
  const section = document.querySelector('[data-section="closing"]');
  if (!section || isReduced) return;

  const lines = gsap.utils.toArray('.line[data-closing-text]');
  const cta = section.querySelector('[data-closing-cta]');
  const footer = section.querySelector('[data-closing-footer]');
  const content = section.querySelector('[data-closing-content]');

  /* the CTA page reprises the dynamic Y-axis reveal — the frame is
     nearly open by the time the type lands */
  const media = section.querySelector('.scene__media-wrap--closing');
  if (media) {
    revealY(media, {
      from: 'inset(30% 0 30% 0)',
      to: 'inset(0 0 0 0)',
      trigger: section,
      start: 'top 95%',
      end: 'top 70%',
      scrub: 0.6,
    });
  }

  maskedTextReveal(lines, {
    trigger: content,
    start: 'top 78%',
    duration: 1.2,
    stagger: 0.14,
  });

  fadeRise(gsap.utils.toArray('[data-closing-text]:not(.line)'), {
    trigger: content,
    start: 'top 74%',
    delay: 0.3,
    y: 22,
    stagger: 0.16,
  });

  if (cta) {
    gsap.fromTo(
      cta,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        delay: 0.35,
        ease: 'power3.out',
        scrollTrigger: { trigger: content, start: 'top 70%', once: true },
      }
    );

    /* final move: the CTA rises a little and settles back —
       empty space expands, the action remains. */
    if (!isReduced) {
      gsap.to(cta, {
        y: -26,
        opacity: 0.82,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'center center',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }
  }

  fadeRise(footer, {
    trigger: footer,
    start: 'top 96%',
    y: 18,
    duration: 1,
  });
}
