/* player.js — play / pause / mute / reset responsibilities for native video */

const state = {
  active: new Set(),
  muted: true,
  pageHidden: false,
};

function applyMute(video) {
  video.muted = state.muted;
  video.defaultMuted = state.muted;
}

export function play(video) {
  if (!video || state.pageHidden) return;
  applyMute(video);
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') {
    // Autoplay can be rejected (battery saver, data saver). Retain the poster
    // frame — the section still reads correctly as a still.
    attempt.catch(() => {});
  }
  state.active.add(video);
}

export function pause(video) {
  if (!video) return;
  video.pause();
  state.active.delete(video);
}

export function reset(video) {
  if (!video) return;
  try {
    video.currentTime = 0;
  } catch (_) {
    /* metadata not ready yet */
  }
}

export function pauseAll() {
  document.querySelectorAll('video[data-video]').forEach((video) => {
    video.pause();
    state.active.delete(video);
  });
}

export function resumeAll() {
  state.active.forEach((video) => play(video));
}

export function setPageHidden(hidden) {
  state.pageHidden = hidden;
  if (hidden) {
    document.querySelectorAll('video[data-video]').forEach((v) => v.pause());
  } else {
    resumeAll();
  }
}

export const player = { play, pause, reset, pauseAll, resumeAll, setPageHidden };
