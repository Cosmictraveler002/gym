/* visibility.js — IntersectionObserver wiring:
   - prepare ~1.5 viewport lengths before entry
   - play only while on screen
   - pause distant clips (never unload: reverse scrolling must not flash)
   - stop decoding when the tab is hidden                                   */

import { player } from './player.js';
import { ensureSrc, preloadFollowing, preloadHero } from './preload.js';

export function initVideoVisibility() {
  const videos = Array.from(document.querySelectorAll('video[data-video]'));

  if (!('IntersectionObserver' in window)) {
    videos.forEach(ensureSrc);
    videos.forEach(player.play);
    return () => {};
  }

  const loader = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ensureSrc(entry.target);
          preloadFollowing(videos, entry.target);
        }
      });
    },
    { rootMargin: '120% 0px 120% 0px', threshold: 0 }
  );

  const player$ = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ensureSrc(entry.target);
          player.play(entry.target);
          preloadFollowing(videos, entry.target);
        } else {
          player.pause(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px 0px 0px', threshold: 0.2 }
  );

  videos.forEach((video) => {
    video.muted = true;
    video.setAttribute('muted', '');
    loader.observe(video);
    player$.observe(video);
  });

  preloadHero();

  const onVisibility = () => player.setPageHidden(document.hidden);
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    loader.disconnect();
    player$.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
