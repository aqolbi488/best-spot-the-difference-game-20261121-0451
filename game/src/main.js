// main.js — Twin Lanterns' game controller: screens, scoring, timer,
// hints and the render loop. It owns the state; render.js draws it,
// input.js feeds it clicks and keys, audio.js sounds it, shots.js freezes
// it for screenshots.

import {
  GAME_NAME, SCENES, POINTS_PER_FIND, TIME_BONUS_PER_SECOND,
  MISS_POINT_PENALTY, MISS_TIME_PENALTY_SEC, HINTS_PER_SCENE,
  HINT_COOLDOWN_MS, HINT_PULSE_MS, CANVAS_W, CANVAS_H,
} from './config.js';
import { SCENE_DEFS } from './scenes.js';
import { renderFrame } from './render.js';
import { bindInput, hitTest, moveCursor } from './input.js';
import { ensureAudio, playChime, playThud, playClick, playFanfare, playTick, toggleMute, isMuted } from './audio.js';
import { readShotParam, shotState } from './shots.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const el = (id) => document.getElementById(id);
const counterEl = el('counter');
const timerEl = el('timer');
const scoreEl = el('score');
const sceneEl = el('scene-name');
const hintsEl = el('hints-left');
const overlayEl = el('overlay');
const messageEl = el('message');

// --- state ---------------------------------------------------------------
const shot = readShotParam();
const frozen = shot ? shotState(shot) : null;

const state = {
  screen: frozen ? frozen.screen : 'title', // title | play | results | sceneDone
  sceneIndex: frozen ? frozen.sceneIndex : 0,
  found: frozen ? [...frozen.found] : [],
  timeLeft: frozen ? frozen.timeLeft : SCENE_DEFS[0].timeLimit,
  hintsLeft: frozen ? frozen.hintsLeft : HINTS_PER_SCENE,
  score: frozen ? frozen.score : 0,
  clicks: frozen ? frozen.clicks : 0,
  misses: frozen ? frozen.misses : 0,
  hint: null, // { index, startedAt }
  hintCooldownUntil: 0,
  cursor: null,
  shakeUntil: 0,
  lastTickSecond: -1,
  results: null, // filled when a scene (or the game) ends
  sceneScores: [],
};

function scene() {
  return SCENE_DEFS[state.sceneIndex];
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function accuracy() {
  if (state.clicks === 0) return 100;
  return Math.round(((state.clicks - state.misses) / state.clicks) * 100);
}

// --- HUD -----------------------------------------------------------------
function updateHud() {
  const total = scene().diffs.length;
  const remaining = total - state.found.length;
  counterEl.textContent = `Found ${state.found.length} of ${total} — ${remaining} to go`;
  timerEl.textContent = formatTime(state.timeLeft);
  timerEl.classList.toggle('urgent', state.screen === 'play' && state.timeLeft <= 30);
  scoreEl.textContent = `Score ${state.score}`;
  sceneEl.textContent = `Set ${state.sceneIndex + 1} of ${SCENES.length} · ${scene().name}`;
  hintsEl.textContent = `Hints ${state.hintsLeft} (H)`;
}

// --- overlays ------------------------------------------------------------
function showTitle() {
  state.screen = 'title';
  overlayEl.classList.remove('hidden');
  overlayEl.innerHTML = `
    <h1>${GAME_NAME}</h1>
    <p class="tagline">Spot the Difference</p>
    <p>Two pictures hang side by side. Seven, nine, then twelve small
    things changed between them. Find them all before the lantern burns down.</p>
    <ul>
      <li>Click a difference — or move the crosshair with the arrow keys and press Enter.</li>
      <li>Wrong clicks cost ${MISS_POINT_PENALTY} points and ${MISS_TIME_PENALTY_SEC} seconds.</li>
      <li>Press H for a hint (${HINTS_PER_SCENE} per set). Press R to restart, M to mute.</li>
    </ul>
    <button id="start-btn" type="button">Light the lanterns — Play</button>
    <p class="fine">Three sets: Harbour at Dawn · Night Market · Mountain Observatory</p>`;
  el('start-btn').addEventListener('click', () => {
    ensureAudio();
    playClick();
    startScene(0);
  });
  updateHud();
}

function showSceneResults(sceneScore, timeBonus) {
  state.screen = 'sceneDone';
  const last = state.sceneIndex === SCENE_DEFS.length - 1;
  overlayEl.classList.remove('hidden');
  overlayEl.innerHTML = `
    <h1>${last ? 'All sets complete!' : `${scene().name} — complete!`}</h1>
    <p class="tagline">${scene().subtitle}</p>
    <p class="stats">Found ${scene().diffs.length} of ${scene().diffs.length} ·
    Time left ${formatTime(state.timeLeft)} · Accuracy ${accuracy()}%</p>
    <p class="stats">Scene score ${sceneScore} (time bonus +${timeBonus}) ·
    Total score ${state.score}</p>
    <button id="next-btn" type="button">${last ? 'See final results' : 'Next set'}</button>
    <button id="again-btn" type="button" class="ghost">Replay this set (R)</button>`;
  el('next-btn').addEventListener('click', () => {
    playClick();
    if (last) showFinalResults();
    else startScene(state.sceneIndex + 1);
  });
  el('again-btn').addEventListener('click', () => {
    playClick();
    startScene(state.sceneIndex);
  });
  updateHud();
}

function showFinalResults() {
  state.screen = 'results';
  const totalFound = state.sceneScores.reduce((a, s) => a + s.found, 0);
  const totalDiffs = SCENE_DEFS.reduce((a, s) => a + s.diffs.length, 0);
  overlayEl.classList.remove('hidden');
  overlayEl.innerHTML = `
    <h1>${GAME_NAME} — Results</h1>
    <p class="tagline">Every lantern found</p>
    <p class="stats">Differences found ${totalFound} of ${totalDiffs}</p>
    <p class="stats">Accuracy ${accuracy()}% · Wrong clicks ${state.misses}</p>
    <p class="stats">Final score ${state.score}</p>
    <button id="restart-btn" type="button">Play again (R)</button>`;
  el('restart-btn').addEventListener('click', () => {
    playClick();
    startScene(0);
  });
  updateHud();
}

function showTimeout() {
  state.screen = 'results';
  overlayEl.classList.remove('hidden');
  overlayEl.innerHTML = `
    <h1>Time ran out</h1>
    <p class="tagline">The lantern burned down over ${scene().name}.</p>
    <p class="stats">Found ${state.found.length} of ${scene().diffs.length} ·
    Score ${state.score}</p>
    <button id="retry-btn" type="button">Try this set again (R)</button>
    <button id="title-btn" type="button" class="ghost">Back to title</button>`;
  el('retry-btn').addEventListener('click', () => {
    playClick();
    startScene(state.sceneIndex);
  });
  el('title-btn').addEventListener('click', () => {
    playClick();
    showTitle();
  });
  updateHud();
}

function flashMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.remove('hidden');
  window.clearTimeout(flashMessage.timer);
  flashMessage.timer = window.setTimeout(() => messageEl.classList.add('hidden'), 1600);
}

// --- flow ----------------------------------------------------------------
function startScene(index) {
  state.sceneIndex = index;
  state.found = [];
  state.timeLeft = SCENE_DEFS[index].timeLimit;
  state.hintsLeft = HINTS_PER_SCENE;
  state.hint = null;
  state.cursor = null;
  state.screen = 'play';
  overlayEl.classList.add('hidden');
  overlayEl.innerHTML = '';
  updateHud();
}

function completeScene() {
  const timeBonus = Math.round(state.timeLeft) * TIME_BONUS_PER_SECOND;
  state.score += timeBonus;
  const sceneScore = state.found.length * POINTS_PER_FIND + timeBonus;
  state.sceneScores.push({ found: state.found.length, score: sceneScore });
  playFanfare();
  showSceneResults(sceneScore, timeBonus);
}

// --- gameplay ------------------------------------------------------------
function onPanelClick(point) {
  ensureAudio();
  if (state.screen !== 'play' || frozen) return;
  state.clicks += 1;
  const idx = hitTest(scene(), state.found, point);
  if (idx >= 0) {
    state.found.push(idx);
    state.score += POINTS_PER_FIND;
    playChime();
    const diff = scene().diffs[idx];
    flashMessage(`Found: ${diff.label}!`);
    if (state.found.length === scene().diffs.length) completeScene();
  } else {
    state.misses += 1;
    state.score = Math.max(0, state.score - MISS_POINT_PENALTY);
    state.timeLeft = Math.max(0, state.timeLeft - MISS_TIME_PENALTY_SEC);
    state.shakeUntil = performance.now() + 220;
    playThud();
    flashMessage(`Not quite — −${MISS_POINT_PENALTY} points, −${MISS_TIME_PENALTY_SEC}s`);
  }
  updateHud();
}

function onHint() {
  ensureAudio();
  if (state.screen !== 'play') return;
  if (frozen) {
    flashMessage('Hints are frozen in this screenshot state.');
    return;
  }
  const now = performance.now();
  if (state.hintsLeft <= 0) {
    flashMessage('No hints left in this set.');
    return;
  }
  if (now < state.hintCooldownUntil) {
    flashMessage('The hint lantern is still rekindling…');
    return;
  }
  const remaining = scene().diffs.map((_, i) => i).filter((i) => !state.found.includes(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hint = { index: pick, startedAt: now };
  state.hintsLeft -= 1;
  state.hintCooldownUntil = now + HINT_COOLDOWN_MS;
  playClick();
  flashMessage('Hint: look where the gold ring pulses.');
  window.setTimeout(() => {
    if (state.hint && performance.now() - state.hint.startedAt > HINT_PULSE_MS) state.hint = null;
  }, HINT_PULSE_MS + 50);
  updateHud();
}

function onRestart() {
  ensureAudio();
  if (state.screen === 'title') return;
  playClick();
  startScene(state.sceneIndex);
}

function onToggleMute() {
  const nowMuted = toggleMute();
  flashMessage(nowMuted ? 'Sound off (M to turn back on)' : 'Sound on');
}

// --- loop ----------------------------------------------------------------
let lastFrame = performance.now();

function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  if (state.screen === 'play' && !frozen) {
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (whole !== state.lastTickSecond) {
      state.lastTickSecond = whole;
      if (whole <= 10 && whole > 0) playTick();
      updateHud();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateHud();
      showTimeout();
    }
  }
  const shake = now < state.shakeUntil ? 8 : 0;
  renderFrame(ctx, {
    scene: scene(),
    found: state.found,
    hint: state.hint,
    cursor: state.cursor,
    shake,
    dim: state.screen === 'play' ? 0 : 0.45,
  });
  requestAnimationFrame(frame);
}

// --- wiring --------------------------------------------------------------
bindInput(canvas, {
  onPanelClick,
  onHint,
  onRestart,
  onToggleMute,
  onCursorClick() {
    if (state.screen !== 'play' || !state.cursor) return false;
    onPanelClick({ side: state.cursor.side, x: state.cursor.x, y: state.cursor.y });
    return true;
  },
  onCursorMove(dx, dy) {
    if (state.screen !== 'play') return false;
    if (!state.cursor) state.cursor = { side: 0, x: 300, y: 280 };
    else state.cursor = moveCursor(state.cursor, dx, dy);
    return true;
  },
});

el('hint-btn').addEventListener('click', onHint);
el('restart-btn-top').addEventListener('click', onRestart);
el('mute-btn').addEventListener('click', () => {
  ensureAudio();
  onToggleMute();
  el('mute-btn').textContent = isMuted() ? 'Sound: off (M)' : 'Sound: on (M)';
});

// Frozen shot states show their overlay instead of the title flow.
if (frozen) {
  if (frozen.screen === 'title') {
    showTitle();
  } else if (frozen.screen === 'results') {
    state.sceneScores = [{ found: 7, score: frozen.score }];
    state.results = { score: frozen.score };
    // A fixed results panel for the end shot: all 7 found, score frozen.
    overlayEl.classList.remove('hidden');
    overlayEl.innerHTML = `
      <h1>Harbour at Dawn — complete!</h1>
      <p class="tagline">Seven quiet changes</p>
      <p class="stats">Found 7 of 7 · Time left ${formatTime(frozen.timeLeft)} · Accuracy 100%</p>
      <p class="stats">Scene score ${frozen.score} · Total score ${frozen.score}</p>
      <button type="button" disabled>Next set</button>`;
  }
  updateHud();
} else {
  showTitle();
}

requestAnimationFrame(frame);
