// scenes.js — the art of Twin Lanterns. Every picture is drawn in code
// (no image files, no copied art): each scene has one paintBase that draws
// the world exactly the same on both panels, and a list of differences.
// A difference is a small painter that draws its element as it appears on
// each side: present on the left and missing on the right, recoloured,
// moved, or resized. Panel coordinates are 600 x 560; the origin is the
// panel's top-left corner and the context is already clipped to the panel.

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// A little gull: two arcs for wings.
function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x - 6 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 6 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

// ---------------------------------------------------------------- harbour
function paintHarbourBase(ctx) {
  // Dawn sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, '#2e4a7a');
  sky.addColorStop(0.45, '#e8907c');
  sky.addColorStop(0.7, '#f7c98b');
  sky.addColorStop(1, '#fbe3b0');
  ctx.fillStyle = sky;
  rect(ctx, 0, 0, 600, 340);
  // Low sun and its glow.
  ctx.fillStyle = '#fff3c4';
  circle(ctx, 300, 210, 46);
  ctx.fillStyle = '#ffd76e';
  circle(ctx, 300, 210, 34);
  // Sleepy clouds.
  ctx.fillStyle = 'rgba(255, 244, 224, 0.9)';
  for (const [cx, cy, cw] of [[90, 90, 90], [420, 60, 110], [240, 130, 70]]) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, cw / 2, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Distant hills.
  ctx.fillStyle = '#7d8aa8';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(140, 260, 300, 320);
  ctx.quadraticCurveTo(450, 270, 600, 325);
  ctx.lineTo(600, 340);
  ctx.lineTo(0, 340);
  ctx.fill();
  // The sea, with light lanes.
  const sea = ctx.createLinearGradient(0, 340, 0, 560);
  sea.addColorStop(0, '#4f7fa8');
  sea.addColorStop(1, '#2c4f74');
  ctx.fillStyle = sea;
  rect(ctx, 0, 340, 600, 220);
  ctx.strokeStyle = 'rgba(255, 220, 150, 0.5)';
  ctx.lineWidth = 3;
  for (const [wy, wl] of [[370, 120], [410, 200], [460, 150], [510, 240]]) {
    line(ctx, 300 - wl / 2, wy, 300 + wl / 2, wy);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (const [wx, wy] of [[80, 390], [500, 380], [180, 470], [430, 500]]) {
    line(ctx, wx - 18, wy, wx + 18, wy);
  }
  // Wooden pier along the bottom.
  ctx.fillStyle = '#8a6844';
  rect(ctx, 0, 470, 600, 90);
  ctx.fillStyle = '#6f5233';
  for (let x = 0; x < 600; x += 48) rect(ctx, x, 470, 4, 90);
  ctx.fillStyle = '#a87f52';
  rect(ctx, 0, 470, 600, 10);
  // A moored fishing boat, left of centre.
  ctx.fillStyle = '#5d3a24';
  ctx.beginPath();
  ctx.moveTo(90, 400);
  ctx.lineTo(230, 400);
  ctx.lineTo(205, 440);
  ctx.lineTo(115, 440);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a4e2e';
  rect(ctx, 130, 372, 60, 28);
  ctx.strokeStyle = '#3a2413';
  ctx.lineWidth = 4;
  line(ctx, 160, 372, 160, 250);
  // Its white sail.
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(164, 258);
  ctx.lineTo(164, 368);
  ctx.lineTo(228, 368);
  ctx.closePath();
  ctx.fill();
  // A second, smaller sailboat on the right.
  ctx.fillStyle = '#4a2f1d';
  ctx.beginPath();
  ctx.moveTo(400, 420);
  ctx.lineTo(500, 420);
  ctx.lineTo(482, 448);
  ctx.lineTo(418, 448);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(452, 300);
  ctx.lineTo(452, 416);
  ctx.lineTo(498, 416);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a2413';
  ctx.lineWidth = 3;
  line(ctx, 450, 416, 450, 298);
  // The lighthouse on the far right point.
  ctx.fillStyle = '#f3ede0';
  rect(ctx, 516, 250, 44, 220);
  ctx.fillStyle = '#c65a4a';
  rect(ctx, 516, 282, 44, 22);
  rect(ctx, 516, 350, 44, 22);
  ctx.fillStyle = '#33415c';
  rect(ctx, 512, 226, 52, 26);
  ctx.fillStyle = '#ffe9a3';
  circle(ctx, 538, 239, 9);
  // Two gulls that are on both panels (the third is a difference).
  gull(ctx, 120, 70, 1, '#2c3550');
  gull(ctx, 210, 110, 0.8, '#2c3550');
  // A striped buoy bobbing in the water.
  ctx.fillStyle = '#e8e2d2';
  circle(ctx, 330, 420, 16);
  ctx.fillStyle = '#33415c';
  rect(ctx, 326, 398, 8, 10);
}

const HARBOUR_DIFFS = [
  {
    x: 480, y: 70, r: 26, label: 'an extra seagull',
    paint(ctx, side) { if (side === 1) gull(ctx, 480, 70, 1, '#2c3550'); },
  },
  {
    x: 160, y: 252, r: 26, label: 'the mast flag colour',
    paint(ctx, side) {
      ctx.fillStyle = side === 0 ? '#d64541' : '#3a6fd8';
      ctx.beginPath();
      ctx.moveTo(160, 250);
      ctx.lineTo(196, 258);
      ctx.lineTo(160, 268);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    x: 538, y: 322, r: 24, label: 'a lighthouse window',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#ffe9a3';
        rect(ctx, 528, 312, 20, 20);
        ctx.strokeStyle = '#33415c';
        ctx.lineWidth = 2;
        ctx.strokeRect(528, 312, 20, 20);
      }
    },
  },
  {
    x: 120, y: 500, r: 30, label: 'a crate on the pier',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#b98a4e';
        rect(ctx, 96, 478, 48, 44);
        ctx.strokeStyle = '#6f5233';
        ctx.lineWidth = 3;
        ctx.strokeRect(96, 478, 48, 44);
        line(ctx, 96, 478, 144, 522);
        line(ctx, 144, 478, 96, 522);
      }
    },
  },
  {
    x: 330, y: 420, r: 26, label: 'the buoy colour',
    paint(ctx, side) {
      ctx.fillStyle = side === 0 ? '#e8722a' : '#3fae6a';
      circle(ctx, 330, 420, 16);
    },
  },
  {
    x: 250, y: 516, r: 28, label: 'a cat on the pier',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#2f2a26';
        ctx.beginPath();
        ctx.ellipse(250, 516, 22, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        circle(ctx, 268, 504, 9);
        ctx.beginPath();
        ctx.moveTo(262, 496);
        ctx.lineTo(264, 488);
        ctx.lineTo(268, 496);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(270, 496);
        ctx.lineTo(273, 488);
        ctx.lineTo(276, 496);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#2f2a26';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(230, 512);
        ctx.quadraticCurveTo(214, 504, 220, 490);
        ctx.stroke();
      }
    },
  },
  {
    x: 196, y: 320, r: 26, label: 'a stripe on the big sail',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#d64541';
        ctx.beginPath();
        ctx.moveTo(164, 312);
        ctx.lineTo(164, 328);
        ctx.lineTo(206, 328);
        ctx.lineTo(196, 312);
        ctx.closePath();
        ctx.fill();
      }
    },
  },
];

// ------------------------------------------------------------------ market
function paintMarketBase(ctx) {
  // Night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#101a3a');
  sky.addColorStop(1, '#2c3a6e');
  ctx.fillStyle = sky;
  rect(ctx, 0, 0, 600, 300);
  // Fixed stars.
  ctx.fillStyle = '#ffe9a3';
  for (const [sx, sy, sr] of [[40, 40, 2], [140, 26, 2.5], [330, 44, 2], [470, 30, 2.5], [560, 70, 2], [240, 60, 2], [90, 110, 1.8]]) {
    circle(ctx, sx, sy, sr);
  }
  // A crescent moon.
  ctx.fillStyle = '#f7ecc8';
  circle(ctx, 520, 90, 30);
  ctx.fillStyle = '#2c3a6e';
  circle(ctx, 534, 82, 26);
  // Rooftops behind the stalls.
  ctx.fillStyle = '#1d2447';
  rect(ctx, 0, 210, 600, 90);
  ctx.fillStyle = '#2a3160';
  for (const [rx, rw, rh] of [[30, 120, 70], [200, 150, 90], [420, 140, 60]]) {
    ctx.beginPath();
    ctx.moveTo(rx, 300);
    ctx.lineTo(rx + rw / 2, 300 - rh);
    ctx.lineTo(rx + rw, 300);
    ctx.closePath();
    ctx.fill();
  }
  // Cobbles.
  ctx.fillStyle = '#3a3350';
  rect(ctx, 0, 300, 600, 260);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  for (let y = 320; y < 560; y += 34) line(ctx, 0, y, 600, y);
  // String lights across the top.
  ctx.strokeStyle = '#0c0f22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(300, 110, 600, 40);
  ctx.stroke();
  // The bulbs on the string (one is a difference).
  for (let i = 0; i < 13; i++) {
    const t = i / 12;
    const bx = t * 600;
    const by = 40 + (110 - 40) * 4 * t * (1 - t) * 0.9 + 6;
    ctx.fillStyle = ['#ff5a5a', '#ffd76e', '#7fd8ff', '#9dff8a'][i % 4];
    circle(ctx, bx, by, 6);
  }
  // Stall one: fruit, striped awning.
  ctx.fillStyle = '#e8e2d2';
  rect(ctx, 60, 330, 200, 120);
  ctx.fillStyle = '#d64541';
  for (let i = 0; i < 5; i++) rect(ctx, 60 + i * 40, 300, 20, 30);
  ctx.fillStyle = '#fdf6e3';
  for (let i = 0; i < 5; i++) rect(ctx, 80 + i * 40, 300, 20, 30);
  // Fruit piles.
  ctx.fillStyle = '#e8722a';
  for (const [fx, fy] of [[100, 400], [120, 400], [140, 400], [110, 382], [130, 382], [120, 364]]) circle(ctx, fx, fy, 11);
  ctx.fillStyle = '#7fb069';
  for (const [fx, fy] of [[190, 400], [210, 400], [200, 382]]) circle(ctx, fx, fy, 11);
  // Stall two: steaming pot, teal awning.
  ctx.fillStyle = '#e8e2d2';
  rect(ctx, 330, 330, 210, 120);
  ctx.fillStyle = '#2a9d8f';
  for (let i = 0; i < 5; i++) rect(ctx, 330 + i * 42, 300, 21, 30);
  ctx.fillStyle = '#fdf6e3';
  for (let i = 0; i < 5; i++) rect(ctx, 351 + i * 42, 300, 21, 30);
  // The pot.
  ctx.fillStyle = '#4a4a55';
  rrect(ctx, 380, 380, 90, 50, 10);
  ctx.fillStyle = '#6a6a78';
  rrect(ctx, 375, 372, 100, 14, 7);
  // Paper lanterns hanging between the stalls.
  ctx.fillStyle = '#d64541';
  ctx.beginPath();
  ctx.ellipse(300, 190, 22, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd76e';
  rect(ctx, 292, 158, 16, 8);
  // Crates and a barrel at the edges.
  ctx.fillStyle = '#8a6844';
  rect(ctx, 470, 470, 60, 50);
  ctx.strokeStyle = '#5d3a24';
  ctx.lineWidth = 3;
  ctx.strokeRect(470, 470, 60, 50);
  ctx.fillStyle = '#6f5233';
  ctx.beginPath();
  ctx.ellipse(40, 500, 26, 34, 0, 0, Math.PI * 2);
  ctx.fill();
}

const MARKET_DIFFS = [
  {
    x: 300, y: 190, r: 30, label: 'the paper lantern colour',
    paint(ctx, side) {
      ctx.fillStyle = side === 0 ? '#d64541' : '#ffd76e';
      ctx.beginPath();
      ctx.ellipse(300, 190, 22, 28, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    x: 160, y: 345, r: 26, label: 'a star on the fruit stall sign',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#ffd76e';
        circle(ctx, 160, 345, 8);
      }
    },
  },
  {
    x: 232, y: 400, r: 24, label: 'an extra green apple',
    paint(ctx, side) { if (side === 1) { ctx.fillStyle = '#7fb069'; circle(ctx, 232, 400, 11); } },
  },
  {
    x: 500, y: 462, r: 28, label: 'a cat on the crate',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#e8e2d2';
        ctx.beginPath();
        ctx.ellipse(500, 462, 20, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        circle(ctx, 517, 451, 8);
        ctx.beginPath();
        ctx.moveTo(512, 444);
        ctx.lineTo(514, 437);
        ctx.lineTo(518, 444);
        ctx.closePath();
        ctx.fill();
      }
    },
  },
  {
    x: 440, y: 250, r: 30, label: 'the parasol colour',
    paint(ctx, side) {
      ctx.fillStyle = side === 0 ? '#8e6fc0' : '#2a9d8f';
      ctx.beginPath();
      ctx.moveTo(380, 250);
      ctx.quadraticCurveTo(440, 196, 500, 250);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#3a2413';
      ctx.lineWidth = 3;
      line(ctx, 440, 250, 440, 300);
    },
  },
  {
    x: 425, y: 352, r: 26, label: 'steam over the pot',
    paint(ctx, side) {
      if (side === 0) {
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(410, 368);
        ctx.quadraticCurveTo(400, 348, 414, 334);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(440, 368);
        ctx.quadraticCurveTo(452, 348, 438, 332);
        ctx.stroke();
      }
    },
  },
  {
    x: 350, y: 78, r: 24, label: 'a bulb out on the string lights',
    paint(ctx, side) {
      if (side === 1) {
        ctx.fillStyle = '#3a3f5c';
        circle(ctx, 350, 78, 6);
      }
    },
  },
  {
    x: 270, y: 300, r: 28, label: 'the vendor’s hat',
    paint(ctx, side) {
      if (side === 0) {
        // The vendor: head and shoulders behind stall two.
        ctx.fillStyle = '#f2c89b';
        circle(ctx, 270, 300, 16);
        ctx.fillStyle = '#e8b04b';
        ctx.beginPath();
        ctx.moveTo(238, 296);
        ctx.quadraticCurveTo(270, 262, 302, 296);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = '#f2c89b';
        circle(ctx, 270, 300, 16);
        ctx.fillStyle = '#3a2413';
        ctx.beginPath();
        ctx.arc(270, 294, 15, Math.PI, 0);
        ctx.fill();
      }
    },
  },
  {
    x: 540, y: 380, r: 26, label: 'the price tag number',
    paint(ctx, side) {
      ctx.fillStyle = '#fdf6e3';
      rrect(ctx, 520, 362, 40, 34, 4);
      ctx.fillStyle = '#1d2447';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(side === 0 ? '5' : '8', 540, 380);
    },
  },
];

// ------------------------------------------------------------- observatory
function paintObservatoryBase(ctx) {
  // Deep night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#070b1e');
  sky.addColorStop(1, '#1b2a55');
  ctx.fillStyle = sky;
  rect(ctx, 0, 0, 600, 320);
  // Fixed stars (one extra is a difference).
  ctx.fillStyle = '#ffffff';
  for (const [sx, sy, sr] of [
    [40, 50, 2], [150, 30, 2.5], [260, 70, 2], [380, 40, 2], [470, 130, 2],
    [60, 150, 2], [200, 140, 1.8], [330, 110, 2.2], [540, 60, 2], [120, 90, 1.6],
  ]) circle(ctx, sx, sy, sr);
  ctx.fillStyle = '#ffe9a3';
  for (const [sx, sy] of [[80, 110], [300, 50], [430, 90]]) {
    circle(ctx, sx, sy, 3);
    line(ctx, sx - 7, sy, sx + 7, sy);
    line(ctx, sx, sy - 7, sx, sy + 7);
  }
  // The moon.
  ctx.fillStyle = '#f7ecc8';
  circle(ctx, 480, 80, 34);
  ctx.fillStyle = '#e0cf9e';
  circle(ctx, 468, 70, 7);
  // Mountain ridges.
  ctx.fillStyle = '#232c4a';
  ctx.beginPath();
  ctx.moveTo(0, 320);
  ctx.lineTo(120, 190);
  ctx.lineTo(240, 320);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1a2140';
  ctx.beginPath();
  ctx.moveTo(180, 320);
  ctx.lineTo(360, 150);
  ctx.lineTo(540, 320);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#141a33';
  ctx.beginPath();
  ctx.moveTo(420, 320);
  ctx.lineTo(540, 210);
  ctx.lineTo(600, 320);
  ctx.closePath();
  ctx.fill();
  // Snow on the middle peak (a bigger cap is a difference).
  ctx.fillStyle = '#eef3fb';
  ctx.beginPath();
  ctx.moveTo(344, 172);
  ctx.lineTo(360, 150);
  ctx.lineTo(376, 172);
  ctx.lineTo(368, 166);
  ctx.lineTo(360, 176);
  ctx.lineTo(352, 166);
  ctx.closePath();
  ctx.fill();
  // The ground.
  ctx.fillStyle = '#2e3a2e';
  rect(ctx, 0, 320, 600, 240);
  // A winding path.
  ctx.fillStyle = '#8a7f68';
  ctx.beginPath();
  ctx.moveTo(260, 560);
  ctx.lineTo(300, 420);
  ctx.lineTo(340, 420);
  ctx.lineTo(380, 560);
  ctx.closePath();
  ctx.fill();
  // The observatory dome.
  ctx.fillStyle = '#c8ccd4';
  ctx.beginPath();
  ctx.arc(300, 330, 70, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9aa0ad';
  rect(ctx, 230, 330, 140, 90);
  ctx.fillStyle = '#3a3f4d';
  rect(ctx, 286, 380, 28, 40);
  // The dome slit and telescope (angle is a difference).
  ctx.fillStyle = '#232733';
  ctx.beginPath();
  ctx.moveTo(300, 262);
  ctx.lineTo(316, 262);
  ctx.lineTo(316, 330);
  ctx.lineTo(300, 330);
  ctx.closePath();
  ctx.fill();
  // Pine trees.
  for (const [tx, ty, ts] of [[120, 430, 1], [500, 450, 1.15], [80, 500, 0.8], [540, 500, 0.9]]) {
    ctx.fillStyle = '#1e4d2e';
    ctx.beginPath();
    ctx.moveTo(tx, ty - 70 * ts);
    ctx.lineTo(tx - 30 * ts, ty);
    ctx.lineTo(tx + 30 * ts, ty);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#4a2f1d';
    rect(ctx, tx - 5 * ts, ty, 10 * ts, 16 * ts);
  }
  // A wooden hut on the left.
  ctx.fillStyle = '#6f5233';
  rect(ctx, 130, 330, 90, 70);
  ctx.fillStyle = '#4a2f1d';
  ctx.beginPath();
  ctx.moveTo(120, 332);
  ctx.lineTo(175, 296);
  ctx.lineTo(230, 332);
  ctx.closePath();
  ctx.fill();
  // An antenna mast on the right.
  ctx.strokeStyle = '#9aa0ad';
  ctx.lineWidth = 4;
  line(ctx, 540, 330, 540, 210);
  line(ctx, 520, 250, 560, 250);
  // A rock beside the path.
  ctx.fillStyle = '#6a6a72';
  ctx.beginPath();
  ctx.ellipse(400, 520, 22, 12, 0, 0, Math.PI * 2);
  ctx.fill();
}

const OBSERVATORY_DIFFS = [
  {
    x: 90, y: 60, r: 24, label: 'an extra star',
    paint(ctx, side) { if (side === 1) { ctx.fillStyle = '#ffffff'; circle(ctx, 90, 60, 2.5); } },
  },
  {
    x: 494, y: 92, r: 24, label: 'a crater on the moon',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#e0cf9e';
        circle(ctx, 494, 92, 6);
      }
    },
  },
  {
    x: 258, y: 356, r: 24, label: 'a lit dome window',
    paint(ctx, side) {
      ctx.fillStyle = side === 0 ? '#ffe9a3' : '#232733';
      rect(ctx, 248, 346, 20, 20);
    },
  },
  {
    x: 316, y: 220, r: 30, label: 'the telescope angle',
    paint(ctx, side) {
      ctx.strokeStyle = '#d8dbe2';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      if (side === 0) {
        line(ctx, 300, 330, 330, 226);
        ctx.fillStyle = '#d8dbe2';
        circle(ctx, 330, 226, 7);
      } else {
        line(ctx, 300, 330, 352, 300);
        ctx.fillStyle = '#d8dbe2';
        circle(ctx, 352, 300, 7);
      }
      ctx.lineCap = 'butt';
    },
  },
  {
    x: 120, y: 420, r: 30, label: 'a pine tree',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#1e4d2e';
        ctx.beginPath();
        ctx.moveTo(120, 360);
        ctx.lineTo(90, 430);
        ctx.lineTo(150, 430);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#4a2f1d';
        rect(ctx, 115, 430, 10, 16);
      }
    },
  },
  {
    x: 520, y: 380, r: 26, label: 'an owl on a branch',
    paint(ctx, side) {
      if (side === 0) {
        ctx.strokeStyle = '#4a2f1d';
        ctx.lineWidth = 5;
        line(ctx, 496, 392, 544, 392);
        ctx.fillStyle = '#8a6844';
        ctx.beginPath();
        ctx.ellipse(520, 378, 12, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffe9a3';
        circle(ctx, 515, 372, 3);
        circle(ctx, 525, 372, 3);
      }
    },
  },
  {
    x: 300, y: 150, r: 26, label: 'the dome flag colour',
    paint(ctx, side) {
      ctx.strokeStyle = '#9aa0ad';
      ctx.lineWidth = 3;
      line(ctx, 300, 258, 300, 148);
      ctx.fillStyle = side === 0 ? '#d64541' : '#3fae6a';
      ctx.beginPath();
      ctx.moveTo(300, 148);
      ctx.lineTo(332, 156);
      ctx.lineTo(300, 166);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    x: 200, y: 100, r: 26, label: 'a shooting star',
    paint(ctx, side) {
      if (side === 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        line(ctx, 180, 88, 216, 112);
        ctx.fillStyle = '#ffffff';
        circle(ctx, 216, 112, 3);
      }
    },
  },
  {
    x: 380, y: 500, r: 24, label: 'a rock on the path',
    paint(ctx, side) {
      if (side === 1) {
        ctx.fillStyle = '#6a6a72';
        ctx.beginPath();
        ctx.ellipse(380, 500, 18, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    x: 450, y: 210, r: 28, label: 'snow on the far peak',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#eef3fb';
        ctx.beginPath();
        ctx.moveTo(526, 228);
        ctx.lineTo(540, 210);
        ctx.lineTo(554, 228);
        ctx.lineTo(546, 222);
        ctx.lineTo(540, 232);
        ctx.lineTo(534, 222);
        ctx.closePath();
        ctx.fill();
      }
    },
  },
  {
    x: 540, y: 206, r: 24, label: 'the antenna light',
    paint(ctx, side) {
      ctx.fillStyle = side === 0 ? '#ff5a5a' : '#3a3f5c';
      circle(ctx, 540, 206, 6);
    },
  },
  {
    x: 150, y: 356, r: 24, label: 'a second hut window',
    paint(ctx, side) {
      if (side === 0) {
        ctx.fillStyle = '#ffe9a3';
        rect(ctx, 140, 346, 18, 18);
      }
      ctx.fillStyle = '#ffe9a3';
      rect(ctx, 188, 346, 18, 18);
    },
  },
];

// The full scene catalogue, in play order.
export const SCENE_DEFS = [
  { id: 'harbour', name: 'Harbour at Dawn', subtitle: 'Seven quiet changes', timeLimit: 180, paintBase: paintHarbourBase, diffs: HARBOUR_DIFFS },
  { id: 'market', name: 'Night Market', subtitle: 'Nine busy changes', timeLimit: 210, paintBase: paintMarketBase, diffs: MARKET_DIFFS },
  { id: 'observatory', name: 'Mountain Observatory', subtitle: 'Twelve starlit changes', timeLimit: 240, paintBase: paintObservatoryBase, diffs: OBSERVATORY_DIFFS },
];
