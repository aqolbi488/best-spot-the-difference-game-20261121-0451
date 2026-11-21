// input.js — mouse, touch and keyboard input for Twin Lanterns.
// A click (or tap) on either panel is tested against the scene's unfound
// differences; the arrow keys move a crosshair cursor and Enter/Space
// "clicks" where it stands, so the whole game is playable by keyboard.
// H asks for a hint, R restarts, M mutes. Nothing here owns game state:
// every event is handed to callbacks main.js supplies.

import { CLICK_RADIUS, PANEL_W, PANEL_H } from './config.js';
import { canvasPointToPanel } from './render.js';

// Find the nearest unfound difference within CLICK_RADIUS of a panel point.
export function hitTest(scene, found, point) {
  let best = -1;
  let bestDist = CLICK_RADIUS;
  scene.diffs.forEach((diff, idx) => {
    if (found.includes(idx)) return;
    const d = Math.hypot(diff.x - point.x, diff.y - point.y);
    if (d < bestDist) {
      bestDist = d;
      best = idx;
    }
  });
  return best;
}

// Wire the canvas and the document. `handlers` supplies:
//   onPanelClick(point) — a click inside a panel, in panel coordinates
//   onHint(), onRestart(), onToggleMute(), onConfirm(), onCursorMove(dx, dy),
//   onCursorClick()
export function bindInput(canvas, handlers) {
  canvas.addEventListener('pointerdown', (event) => {
    const point = canvasPointToPanel(event.clientX, event.clientY, canvas.getBoundingClientRect());
    if (point) handlers.onPanelClick(point);
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'h' || key === 'H') {
      handlers.onHint();
    } else if (key === 'r' || key === 'R') {
      handlers.onRestart();
    } else if (key === 'm' || key === 'M') {
      handlers.onToggleMute();
    } else if (key === 'Enter' || key === ' ') {
      if (handlers.onCursorClick()) event.preventDefault();
    } else if (key.startsWith('Arrow')) {
      const step = event.shiftKey ? 60 : 18;
      const moves = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const [dx, dy] = moves[key];
      if (handlers.onCursorMove(dx, dy)) event.preventDefault();
    }
  });
}

// Keep a keyboard cursor inside its panel; crossing an edge hops it to
// the other panel, so both pictures are reachable by keyboard alone.
export function moveCursor(cursor, dx, dy) {
  let { side, x, y } = cursor;
  x += dx;
  y += dy;
  if (x < 0) {
    side = side === 0 ? 1 : 0;
    x = PANEL_W + x;
  } else if (x > PANEL_W) {
    side = side === 0 ? 1 : 0;
    x -= PANEL_W;
  }
  x = Math.max(0, Math.min(PANEL_W, x));
  y = Math.max(0, Math.min(PANEL_H, y));
  return { side, x, y };
}
