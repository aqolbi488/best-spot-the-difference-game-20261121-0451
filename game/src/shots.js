// shots.js — deterministic states for screenshots, so a render of the
// game is reproducible: the same URL query always shows the same frame.
//   ?shot=start  title screen over scene 1, nothing found yet
//   ?shot=play   mid-game in scene 1: 3 differences found and marked,
//                counter showing 4 still to go
//   ?shot=end    scene 1 complete: all 7 found, results screen up
// Without ?shot the game starts normally on its title screen. Shot states
// freeze the timer and the score at the values config.js fixes.

import { SHOT_STATES } from './config.js';

export function readShotParam() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (shot === 'start' || shot === 'play' || shot === 'end') return shot;
  return null;
}

// Build the frozen game state a shot shows. Returns null for no shot.
export function shotState(shot) {
  const preset = SHOT_STATES[shot];
  if (!preset) return null;
  return {
    shot,
    screen: shot === 'start' ? 'title' : shot === 'play' ? 'play' : 'results',
    sceneIndex: preset.scene,
    found: [...preset.found],
    timeLeft: preset.timeLeft,
    hintsLeft: preset.hintsLeft,
    score: preset.score,
    clicks: shot === 'end' ? 7 : shot === 'play' ? 3 : 0,
    misses: 0,
    sceneComplete: shot === 'end',
  };
}
