// Converts the uploaded WebP image to a high-quality JPEG for the hero background.
const fs = require("fs");
const path = require("path");

const SRC = path.join(process.env.TEMP, "c5.bin"); // uploaded image (webp)
const OUT = path.join("public", "images", "hero-villa.jpg");

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    sharp = require(path.join(process.cwd(), "node_modules", "next", "node_modules", "sharp"));
  }
  const buf = fs.readFileSync(SRC);
  await sharp(buf).jpeg({ quality: 90 }).toFile(OUT);
  console.log("wrote", OUT, fs.statSync(OUT).size, "bytes");
}

main().catch((e) => { console.error(e); process.exit(1); });
