'use strict';
/**
 * scripts/gen-assets.js
 * Generates icon + splash PNG assets for CricLens.
 * Pure Node.js — no npm packages needed.
 *
 * Run: node scripts/gen-assets.js
 */

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../assets/images');

// ── PNG encoder ───────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length);
  const crc = Buffer.allocUnsafe(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePNG(width, height, rgba) {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const rows = Buffer.allocUnsafe(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rows[y * (width * 4 + 1)] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 4;
      const di = y * (width * 4 + 1) + 1 + x * 4;
      rows[di]     = rgba[si];
      rows[di + 1] = rgba[si + 1];
      rows[di + 2] = rgba[si + 2];
      rows[di + 3] = rgba[si + 3];
    }
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(rows, { level: 6 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Drawing helpers ───────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

// Smooth mask: 1 inside shape (sdf < 0), 0 outside (sdf > 0), anti-aliased at boundary
function mask(sdf, feather = 1.5) {
  return Math.max(0, Math.min(1, 0.5 - sdf / feather));
}

function blendOver(bg, fg, alpha) {
  return [
    lerp(bg[0], fg[0], alpha),
    lerp(bg[1], fg[1], alpha),
    lerp(bg[2], fg[2], alpha),
  ];
}

// ── CricLens icon pixel renderer ─────────────────────────────────────────────
//
//  Design:
//    • Dark forest-green background
//    • Thick white "C" arc (270° lens / scope)
//    • Red cricket ball visible in the open gap of the "C"
//    • White seam cross on the ball
//    • Small white dot at center (the lens focal point)
//    • White tip dots at both ends of the "C" arc

function iconPixel(x, y, size, transparent = false) {
  const cx = size / 2, cy = size / 2;
  const px = x - cx,  py = y - cy;
  const dist  = Math.hypot(px, py);
  const angle = Math.atan2(py, px); // -π .. π

  // Background
  let r = 0x0F, g = 0x2D, b = 0x1A;
  let a = transparent ? 0 : 255;

  // Subtle radial vignette on background
  if (!transparent) {
    const vigT = Math.max(0, 1 - dist / (size * 0.62));
    r = lerp(r, 0x17, vigT * 0.6);
    g = lerp(g, 0x40, vigT * 0.6);
    b = lerp(b, 0x26, vigT * 0.6);
  }

  // ── "C" arc ────────────────────────────────────────────────────────────────
  const arcOuter   = size * 0.358;
  const arcInner   = size * 0.240;
  const gapHalf    = 57 * (Math.PI / 180); // half-angle of the right-side gap
  const arcFeather = 3.0;
  const angFeather = 5 * (Math.PI / 180);  // angular blend at gap edges

  const arcMask =
    Math.min(
      mask(dist - arcOuter, arcFeather),  // inside outer circle
      mask(arcInner - dist, arcFeather),  // outside inner circle
    ) *
    mask(gapHalf - Math.abs(angle), angFeather); // not in the gap

  if (arcMask > 0) {
    // Bright white arc with a subtle inner highlight
    const highlightT = mask(dist - (arcOuter - arcFeather * 4), arcFeather * 6) * 0.15;
    const wR = lerp(220, 255, highlightT);
    const wG = lerp(220, 255, highlightT);
    const wB = lerp(220, 255, highlightT);
    r = lerp(r, wR, arcMask);
    g = lerp(g, wG, arcMask);
    b = lerp(b, wB, arcMask);
    if (transparent) a = Math.round(lerp(a, 255, arcMask));
  }

  // ── Tip dots at the "C" arc ends ───────────────────────────────────────────
  const tipR   = (arcOuter + arcInner) / 2;
  const tipRad = (arcOuter - arcInner) / 2 + 2;
  for (const tipAngle of [gapHalf, -gapHalf]) {
    const tcx = cx + tipR * Math.cos(tipAngle);
    const tcy = cy + tipR * Math.sin(tipAngle);
    const td  = Math.hypot(x - tcx, y - tcy);
    const tm  = mask(td - tipRad, arcFeather);
    if (tm > 0) {
      r = lerp(r, 255, tm);
      g = lerp(g, 255, tm);
      b = lerp(b, 255, tm);
      if (transparent) a = Math.round(lerp(a, 255, tm));
    }
  }

  // ── Cricket ball (red) in the "C" gap ─────────────────────────────────────
  const ballCx = cx + (arcOuter + arcInner) / 2 * Math.cos(0); // right side
  const ballCy = cy;
  const ballR  = size * 0.060;
  const bd     = Math.hypot(x - ballCx, y - ballCy);
  const bm     = mask(bd - ballR, arcFeather);

  if (bm > 0) {
    r = lerp(r, 0xDC, bm);
    g = lerp(g, 0x26, bm);
    b = lerp(b, 0x26, bm);
    if (transparent) a = Math.round(lerp(a, 255, bm));

    // White seam lines on the ball
    const bpx = x - ballCx, bpy = y - ballCy;
    const seamW = size * 0.009;
    const insideBall = bd < ballR - 2;
    if (insideBall) {
      const hSeam = mask(Math.abs(bpy) - seamW, 1.5) * 0.55;
      const vSeam = mask(Math.abs(bpx) - seamW, 1.5) * 0.55;
      const sm = Math.max(hSeam, vSeam);
      r = lerp(r, 255, sm);
      g = lerp(g, 255, sm);
      b = lerp(b, 255, sm);
    }
  }

  // ── Center focal dot ───────────────────────────────────────────────────────
  const dotR  = size * 0.046;
  const dotM  = mask(dist - dotR, arcFeather);
  if (dotM > 0) {
    r = lerp(r, 255, dotM);
    g = lerp(g, 255, dotM);
    b = lerp(b, 255, dotM);
    if (transparent) a = Math.round(lerp(a, 255, dotM));
  }

  return [Math.round(r), Math.round(g), Math.round(b), a];
}

// ── Rasterise ─────────────────────────────────────────────────────────────────

function render(size, pixelFn) {
  const rgba = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelFn(x, y, size);
      const i = (y * size + x) * 4;
      rgba[i] = r; rgba[i + 1] = g; rgba[i + 2] = b; rgba[i + 3] = a;
    }
  }
  return rgba;
}

function save(filename, rgba, size) {
  const buf = encodePNG(size, size, rgba);
  fs.writeFileSync(path.join(OUT, filename), buf);
  console.log(`  ✓ ${filename}  (${size}×${size}, ${(buf.length / 1024).toFixed(0)} KB)`);
}

// ── Solid-color fill ──────────────────────────────────────────────────────────

function solidRGBA(size, r, g, b, a = 255) {
  const rgba = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    rgba[i * 4]     = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = a;
  }
  return rgba;
}

// ── Generate all assets ───────────────────────────────────────────────────────

console.log('\nGenerating CricLens assets...\n');

// icon.png — 1024×1024, opaque green background
save('icon.png', render(1024, (x, y, s) => iconPixel(x, y, s, false)), 1024);

// splash-icon.png — same design, slightly larger scale for centered splash
save('splash-icon.png', render(1024, (x, y, s) => {
  // scale down the design by 0.78 so it sits comfortably inside the splash canvas
  const scale = 0.78;
  const cx = s / 2, cy = s / 2;
  const nx = cx + (x - cx) / scale;
  const ny = cy + (y - cy) / scale;
  if (nx < 0 || nx >= s || ny < 0 || ny >= s) return [0x0F, 0x2D, 0x1A, 255];
  return iconPixel(nx, ny, s, false);
}), 1024);

// android-icon-foreground.png — transparent BG, design centered in safe zone (72%)
save('android-icon-foreground.png', render(1024, (x, y, s) => {
  const scale = 0.65; // shrink into Android safe zone
  const cx = s / 2, cy = s / 2;
  const nx = cx + (x - cx) / scale;
  const ny = cy + (y - cy) / scale;
  if (nx < 0 || nx >= s || ny < 0 || ny >= s) return [0, 0, 0, 0];
  return iconPixel(nx, ny, s, true); // transparent background
}), 1024);

// android-icon-background.png — solid dark green
save('android-icon-background.png', solidRGBA(1024, 0x0F, 0x2D, 0x1A), 1024);

// android-icon-monochrome.png — white design on transparent (Android 12 themed icons)
save('android-icon-monochrome.png', render(1024, (x, y, s) => {
  const scale = 0.65;
  const cx = s / 2, cy = s / 2;
  const nx = cx + (x - cx) / scale;
  const ny = cy + (y - cy) / scale;
  if (nx < 0 || nx >= s || ny < 0 || ny >= s) return [0, 0, 0, 0];
  const [r, g, b, a] = iconPixel(nx, ny, s, true);
  // Convert to grayscale white — keep alpha, force white
  return [255, 255, 255, a];
}), 1024);

// favicon.png — small 48×48
save('favicon.png', render(48, (x, y, s) => iconPixel(x, y, s, false)), 48);

console.log('\nAll assets generated.\n');
