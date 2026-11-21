// Generates a premium dark-gradient "dusk villa" placeholder hero image (2075x1150 JPEG)
// via PNG encode + canvas-free pixel math, then converts to JPEG via next's sharp if available,
// otherwise writes PNG and we point the code at .png.
const W = 2075, H = 1150;
const buf = Buffer.alloc(W * H * 3);

function clamp(v) { return v < 0 ? 0 : v > 255 ? 255 : v | 0; }

// Sky gradient (deep indigo dusk -> warm amber horizon glow slightly below center)
for (let y = 0; y < H; y++) {
  const t = y / H;
  // base dusk gradient
  let r = 12 + 60 * Math.pow(t, 1.6);
  let g = 10 + 34 * Math.pow(t, 2.0);
  let b = 28 + 26 * Math.pow(t, 1.2);
  // warm horizon band around t=0.62
  const band = Math.exp(-Math.pow((t - 0.62) / 0.10, 2));
  r += 150 * band; g += 90 * band; b += 30 * band;
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    // subtle horizontal vignette
    const vx = Math.abs(x / W - 0.5) * 2;
    const vin = 1 - 0.35 * vx * vx;
    // faint stars in upper third
    let star = 0;
    if (t < 0.35) {
      const h = (x * 374761393 + y * 668265263) >>> 0;
      if ((h % 9973) < 4) star = 90 + (h % 120);
    }
    buf[i] = clamp(r * vin + star);
    buf[i + 1] = clamp(g * vin + star);
    buf[i + 2] = clamp(b * vin + star);
  }
}

// Silhouette skyline: layered modern villa blocks on the horizon
function drawRect(x0, y0, x1, y1, r, g, b) {
  for (let y = Math.max(0, y0 | 0); y < Math.min(H, y1 | 0); y++) {
    for (let x = Math.max(0, x0 | 0); x < Math.min(W, x1 | 0); x++) {
      const i = (y * W + x) * 3;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b;
    }
  }
}
const HZ = 0.72 * H; // horizon line
const dark = [8, 9, 14];
// main villa mass
drawRect(W * 0.18, HZ - H * 0.16, W * 0.55, HZ, ...dark);
drawRect(W * 0.30, HZ - H * 0.24, W * 0.72, HZ, ...dark); // taller wing
drawRect(W * 0.60, HZ - H * 0.10, W * 0.92, HZ, ...dark);
// thin roof overhangs
drawRect(W * 0.16, HZ - H * 0.175, W * 0.57, HZ - H * 0.16, 14, 15, 22);
drawRect(W * 0.28, HZ - H * 0.255, W * 0.74, HZ - H * 0.24, 14, 15, 22);
// warm lit windows (grid of glowing rectangles)
function windows(x0, y0, x1, y1, cols, rows, r, g, b) {
  const cw = (x1 - x0) / cols, ch = (y1 - y0) / rows;
  for (let c = 0; c < cols; c++) {
    for (let rw = 0; rw < rows; rw++) {
      const seed = (c * 73856093 ^ rw * 19349663) >>> 0;
      if (seed % 5 < 2) continue; // some windows dark
      drawRect(x0 + c * cw + cw * 0.25, y0 + rw * ch + ch * 0.3,
        x0 + c * cw + cw * 0.75, y0 + rw * ch + ch * 0.7, r, g, b);
    }
  }
}
windows(W * 0.20, HZ - H * 0.15, W * 0.53, HZ, 8, 3, 235, 190, 110);
windows(W * 0.32, HZ - H * 0.23, W * 0.70, HZ, 9, 4, 240, 200, 120);
windows(W * 0.62, HZ - H * 0.09, W * 0.90, HZ, 7, 2, 235, 190, 110);

// pool reflection: shimmering warm strip below horizon
for (let y = Math.ceil(HZ); y < H; y++) {
  const dt = (y - HZ) / (H - HZ);
  const fade = Math.exp(-dt * 5);
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    // pool reflection: soft warm glow, gentle ripple, vertical smoothing
    const dt = (y - HZ) / (H - HZ);
    const fade = Math.exp(-dt * 4);
    const phase = Math.sin(x * 0.018 + Math.sin(y * 0.05) * 2.0);
    const ripple = 0.75 + 0.25 * phase;
    const iNext = y + 1 < H ? ((y + 1) * W + x) * 3 : i;
    const baseR = (buf[i] + buf[iNext]) / 2;
    const baseG = (buf[i + 1] + buf[iNext + 1]) / 2;
    const baseB = (buf[i + 2] + buf[iNext + 2]) / 2;
    const add = 55 * fade;
    buf[i] = clamp(baseR + add * ripple);
    buf[i + 1] = clamp(baseG + add * ripple * 0.8);
    buf[i + 2] = clamp(baseB + add * ripple * 0.45);
  }
}

// Encode PNG (no zlib dep issues: use zlib from node)
const zlib = require("zlib");
const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0; // filter none
  buf.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3);
}
const idat = zlib.deflateSync(raw, { level: 9 });
const chunks = [];
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crcBuf = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(crcBuf) >>> 0);
  chunks.push(len, t, data, crc);
}
let crcTable = [];
for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcTable[n] = c; }
function crc32(b) { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return c ^ 0xffffffff; }
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; // 8-bit, truecolor
chunks.push(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
chunk("IHDR", ihdr);
chunk("IDAT", idat);
chunk("IEND", Buffer.alloc(0));
require("fs").writeFileSync("public/images/hero-villa.png", Buffer.concat(chunks));
console.log("wrote public/images/hero-villa.png", Buffer.concat(chunks).length, "bytes");
