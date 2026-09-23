/* preload.js — load the current clip early, warm the next one, keep
   the payload small (nothing downloads until it is ~1.5 viewports away). */

export function ensureSrc(video) {
  if (!video) return;
  const pending = video.getAttribute('data-src');
  if (pending && !video.getAttribute('src')) {
    video.setAttribute('src', pending);
    video.preload = 'auto';
    video.load();
  }
}

/** Warm the clip that follows the active one in document order. */
export function preloadFollowing(list, current) {
  const index = list.indexOf(current);
  if (index === -1) return;
  ensureSrc(list[index + 1]);
  ensureSrc(list[index + 2]);
}

/** First paint: only the hero is fetched. */
export function preloadHero() {
  const hero = document.querySelector('video[data-video]');
  if (hero) ensureSrc(hero);
}
