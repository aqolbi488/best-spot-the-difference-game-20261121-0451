// config.js — the single place for Twin Lanterns' tuning numbers and
// scene list. Every other module reads these; nothing else hard-codes a
// score, a timer length or a panel size.

// The game: find every difference between two near-identical pictures.
export const GAME_NAME = 'Twin Lanterns';
export const GAME_TAGLINE = 'Spot the Difference';

// One picture panel, in canvas pixels. Two panels sit side by side with
// PANEL_GAP between them; PANEL_TOP leaves room for the in-canvas labels.
export const PANEL_W = 600;
export const PANEL_H = 560;
export const PANEL_TOP = 24;
export const PANEL_LEFT_X = 24;
export const PANEL_RIGHT_X = PANEL_LEFT_X + PANEL_W + 32;
export const CANVAS_W = PANEL_RIGHT_X + PANEL_W + 24;
export const CANVAS_H = PANEL_TOP + PANEL_H + 24;

// Click tolerance around a difference centre, in panel pixels.
export const CLICK_RADIUS = 34;

// Scoring and pressure.
export const POINTS_PER_FIND = 100;
export const TIME_BONUS_PER_SECOND = 2;
export const MISS_POINT_PENALTY = 25;
export const MISS_TIME_PENALTY_SEC = 5;
export const HINTS_PER_SCENE = 3;
export const HINT_COOLDOWN_MS = 8000;
export const HINT_PULSE_MS = 1800;

// The three scene sets, in rising difficulty. timeLimit is seconds per scene.
export const SCENES = [
  { id: 'harbour', name: 'Harbour at Dawn', subtitle: 'Seven quiet changes', timeLimit: 180, diffs: 7 },
  { id: 'market', name: 'Night Market', subtitle: 'Nine busy changes', timeLimit: 210, diffs: 9 },
  { id: 'observatory', name: 'Mountain Observatory', subtitle: 'Twelve starlit changes', timeLimit: 240, diffs: 12 },
];

// Deterministic screenshot states (see shots.js): the timer and score the
// shot states freeze on, so a screenshot is reproducible.
export const SHOT_STATES = {
  start: { scene: 0, found: [], timeLeft: 180, hintsLeft: 3, score: 0 },
  play: { scene: 0, found: [0, 1, 2], timeLeft: 151, hintsLeft: 2, score: 300 },
  end: { scene: 0, found: [0, 1, 2, 3, 4, 5, 6], timeLeft: 96, hintsLeft: 3, score: 892 },
};
