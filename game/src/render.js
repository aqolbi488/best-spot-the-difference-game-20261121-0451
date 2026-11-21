// render.js — draws Twin Lanterns onto the canvas: the two panels, the
// found-difference markers, the hint pulse, the keyboard cursor and the
// panel labels. It never owns game state; main.js hands it a snapshot.

import {
  CANVAS_W, CANVAS_H, PANEL_W, PANEL_H, PANEL_TOP, PANEL_LEFT_X, PANEL_RIGHT_X,
} from './config.js';

function panelOrigin(side) {
  return side === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X;
}

// Draw one scene into one panel. `side` 0 is the left picture, 1 the right.
export function drawPanel(ctx, scene, side) {
  const ox = panelOrigin(side);
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, PANEL_TOP, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(ox, PANEL_TOP);
  scene.paintBase(ctx);
  for (const diff of scene.diffs) diff.paint(ctx, side);
  ctx.restore();
}

// The green ring + check that marks a found difference on both panels.
function drawFoundMark(ctx, ox, diff, now) {
  const cx = ox + diff.x;
  const cy = PANEL_TOP + diff.y;
  const pulse = 1 + 0.06 * Math.sin(now / 180);
  const r = (diff.r + 6) * pulse;
  ctx.strokeStyle = '#37c978';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  // The check.
  ctx.strokeStyle = '#37c978';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 11, cy);
  ctx.lineTo(cx - 3, cy + 9);
  ctx.lineTo(cx + 12, cy - 9);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

// A gold pulsing ring that hints at one unfound difference.
function drawHintPulse(ctx, ox, diff, startedAt, now) {
  const age = now - startedAt;
  const t = (age % 600) / 600;
  const cx = ox + diff.x;
  const cy = PANEL_TOP + diff.y;
  const r = diff.r + 6 + t * 18;
  ctx.strokeStyle = `rgba(255, 215, 110, ${1 - t})`;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// The keyboard cursor: a small crosshair the arrow keys move.
function drawCursor(ctx, cursor) {
  if (!cursor) return;
  const ox = panelOrigin(cursor.side);
  const cx = ox + cursor.x;
  const cy = PANEL_TOP + cursor.y;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 18, cy);
  ctx.lineTo(cx - 8, cy);
  ctx.moveTo(cx + 8, cy);
  ctx.lineTo(cx + 18, cy);
  ctx.moveTo(cx, cy - 18);
  ctx.lineTo(cx, cy - 8);
  ctx.moveTo(cx, cy + 8);
  ctx.lineTo(cx, cy + 18);
  ctx.stroke();
}

function drawPanelLabel(ctx, side, text) {
  const ox = panelOrigin(side);
  ctx.fillStyle = 'rgba(10, 14, 30, 0.65)';
  ctx.beginPath();
  ctx.roundRect(ox + 10, PANEL_TOP + 10, 34, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, ox + 27, PANEL_TOP + 24);
}

// Full frame. `view` carries: scene, found (array of diff indexes),
// hint (the pulsing diff index + startedAt, or null), cursor, shake (px),
// and dim (0..1, darkens the panels under an overlay).
export function renderFrame(ctx, view) {
  const now = performance.now();
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.save();
  if (view.shake) {
    ctx.translate((Math.random() - 0.5) * view.shake, (Math.random() - 0.5) * view.shake);
  }
  // Panel frames.
  for (const side of [0, 1]) {
    const ox = panelOrigin(side);
    ctx.fillStyle = '#0e1428';
    ctx.beginPath();
    ctx.roundRect(ox - 6, PANEL_TOP - 6, PANEL_W + 12, PANEL_H + 12, 10);
    ctx.fill();
    drawPanel(ctx, view.scene, side);
    drawPanelLabel(ctx, side, side === 0 ? 'A' : 'B');
  }
  // Found markers on both panels.
  for (const idx of view.found) {
    const diff = view.scene.diffs[idx];
    drawFoundMark(ctx, PANEL_LEFT_X, diff, now);
    drawFoundMark(ctx, PANEL_RIGHT_X, diff, now);
  }
  // Hint pulse on both panels.
  if (view.hint) {
    const diff = view.scene.diffs[view.hint.index];
    drawHintPulse(ctx, PANEL_LEFT_X, diff, view.hint.startedAt, now);
    drawHintPulse(ctx, PANEL_RIGHT_X, diff, view.hint.startedAt, now);
  }
  drawCursor(ctx, view.cursor);
  ctx.restore();
  if (view.dim > 0) {
    ctx.fillStyle = `rgba(8, 10, 24, ${view.dim})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
}

// Convert a canvas click (css pixels, canvas is shown at its own size) to
// a panel hit: { side, x, y } in panel coordinates, or null outside both.
export function canvasPointToPanel(clientX, clientY, canvasRect) {
  const x = ((clientX - canvasRect.left) / canvasRect.width) * CANVAS_W;
  const y = ((clientY - canvasRect.top) / canvasRect.height) * CANVAS_H;
  for (const side of [0, 1]) {
    const ox = panelOrigin(side);
    if (x >= ox && x <= ox + PANEL_W && y >= PANEL_TOP && y <= PANEL_TOP + PANEL_H) {
      return { side, x: x - ox, y: y - PANEL_TOP };
    }
  }
  return null;
}
