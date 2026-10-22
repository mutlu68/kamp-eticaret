/**
 * SVG PLACEHOLDER ÜRETECİ
 * =======================
 * Ürün ve kategori görsellerini `public/img/` altına üretir.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * Neden uzak servis (picsum vb.) değil de yerel SVG:
 *  - internet olmadan da çalışır, build hiç kırılmaz
 *  - dosyalar birkaç KB, LCP ölçümünü bozmaz
 *  - her ürün kendi kategorisinin çizimini ve kendi renk varyantını alır,
 *    yani kartlarda "hover'da 2. görsel" efekti anlamlı görünür
 *
 * GERÇEK FOTOĞRAFA GEÇİŞ: aynı isimli .webp dosyalarını public/img/products/
 * altına koyup src/lib/data/products.ts içindeki uzantıları değiştirin.
 * Bu script'i tekrar çalıştırmaya gerek yok.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { products } from "../src/lib/data/products.ts";
import { categories } from "../src/lib/data/categories.ts";

/**
 * SVG bir XML belgesidir: metin içindeki `&`, `<`, `>` karakterleri kaçırılmazsa
 * tarayıcı DOSYANIN TAMAMINI ayrıştıramaz ve görsel kırık görünür.
 * ("Kamp Ocağı & Pişirme" başlığı tam olarak buna yol açmıştı.)
 */
function xmlEscape(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, "..", "public", "img");

/** Tasarım token'larıyla aynı palet — görseller siteyle aynı dilde konuşsun. */
const INK = "#1E2D24";
const SURFACE = "#F2F1EA";
const SURFACE_2 = "#E8E7DD";
const SAGE = "#5C6B5E";

/** Kategori başına varsayılan aksan rengi ve çizim. */
const CATEGORY_ACCENT = {
  "cat-cadir": "#4a5d43",
  "cat-uyku-tulumu": "#3f7d7a",
  "cat-kamp-ocagi": "#8a5a2b",
  "cat-sirt-cantasi": "#3a4a5c",
  "cat-aydinlatma": "#9a7b2e",
  "cat-kamp-mobilyasi": "#5c6b5e",
  "cat-aksesuar": "#6e5a4a",
};

/**
 * Kategori çizimleri. Hepsi 0 0 100 100 kutusuna çizilir; yerleştirme ve
 * ölçekleme dışarıda transform ile yapılır.
 */
const GLYPHS = {
  // Çadır: çift tenteli sırt silueti + kapı yarığı
  "cat-cadir": (c) => `
    <path d="M8 78 L50 20 L92 78 Z" fill="${c}" fill-opacity="0.16"/>
    <path d="M8 78 L50 20 L92 78" fill="none" stroke="${c}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M50 20 L50 78" stroke="${c}" stroke-width="2" opacity="0.65"/>
    <path d="M38 78 L50 46 L62 78 Z" fill="${SURFACE}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M4 78 L96 78" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M50 20 L50 12" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,

  // Uyku tulumu: mumya kesim kapsül + fermuar
  "cat-uyku-tulumu": (c) => `
    <path d="M26 24 q24 -12 44 4 q10 9 8 26 q-2 20 -14 30 q-12 10 -26 4 q-14 -6 -16 -26 q-2 -26 4 -38 Z"
      fill="${c}" fill-opacity="0.16" stroke="${c}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M34 28 q20 -8 34 6" fill="none" stroke="${c}" stroke-width="2" opacity="0.7"/>
    <path d="M62 30 q8 26 -4 52" fill="none" stroke="${c}" stroke-width="2.4" stroke-dasharray="3 4"/>
    <circle cx="62" cy="30" r="3" fill="${c}"/>`,

  // Kamp ocağı: brülör tabla + alev
  "cat-kamp-ocagi": (c) => `
    <path d="M50 18 q10 10 10 18 a10 10 0 0 1 -20 0 q0 -8 10 -18 Z"
      fill="${c}" fill-opacity="0.22" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/>
    <ellipse cx="50" cy="58" rx="26" ry="8" fill="none" stroke="${c}" stroke-width="2.6"/>
    <path d="M24 58 v6 q0 4 6 4 h40 q6 0 6 -4 v-6" fill="${c}" fill-opacity="0.14" stroke="${c}" stroke-width="2.4"/>
    <path d="M32 72 L26 86 M68 72 L74 86 M50 72 L50 88" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`,

  // Sırt çantası: kapaklı gövde + askılar
  "cat-sirt-cantasi": (c) => `
    <rect x="28" y="30" width="44" height="54" rx="12" fill="${c}" fill-opacity="0.16" stroke="${c}" stroke-width="2.6"/>
    <path d="M28 46 q22 10 44 0" fill="none" stroke="${c}" stroke-width="2.4"/>
    <path d="M36 30 q0 -16 14 -16 q14 0 14 16" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="40" y="56" width="20" height="16" rx="4" fill="${SURFACE}" stroke="${c}" stroke-width="2"/>
    <path d="M22 40 q-4 18 4 32 M78 40 q4 18 -4 32" fill="none" stroke="${c}" stroke-width="2.2" opacity="0.6"/>`,

  // Aydınlatma: fener gövdesi + kulp
  "cat-aydinlatma": (c) => `
    <path d="M40 12 q10 -8 20 0" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="44" y="12" width="12" height="10" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/>
    <path d="M32 28 h36 l6 34 q1 8 -8 8 h-32 q-9 0 -8 -8 Z"
      fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M40 38 v16 M50 36 v20 M60 38 v16" stroke="${c}" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
    <path d="M30 78 h40" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M16 46 h-8 M84 46 h8 M22 30 l-6 -5 M78 30 l6 -5" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>`,

  // Kamp mobilyası: katlanır sandalye
  "cat-kamp-mobilyasi": (c) => `
    <path d="M28 30 L44 62 h26 L58 30 Z" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M44 62 L30 86 M70 62 L84 86" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M36 62 L74 84 M78 62 L38 84" stroke="${c}" stroke-width="2.2" stroke-linecap="round" opacity="0.55"/>
    <path d="M26 28 h34" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`,

  // Aksesuar: matara + çakı
  "cat-aksesuar": (c) => `
    <rect x="30" y="26" width="24" height="56" rx="10" fill="${c}" fill-opacity="0.16" stroke="${c}" stroke-width="2.6"/>
    <rect x="36" y="16" width="12" height="10" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/>
    <path d="M30 44 h24" stroke="${c}" stroke-width="2.2" opacity="0.6"/>
    <path d="M64 34 q14 6 14 22 q0 16 -14 22 Z" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M64 34 v44" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`,
};

/** İnce topografya çizgileri — hero ve footer'daki desenle aynı dil. */
function topoLines(opacity = 0.5) {
  const rings = [];
  for (let i = 0; i < 5; i++) {
    const r = 120 + i * 46;
    rings.push(
      `<ellipse cx="500" cy="980" rx="${r * 1.5}" ry="${r * 0.62}" fill="none" stroke="${SAGE}" stroke-width="1.6" opacity="${opacity * (1 - i * 0.14)}"/>`,
    );
  }
  return rings.join("\n    ");
}

/**
 * Kompozisyon varyantları. Aynı çizimi farklı ölçek/konumda göstererek
 * "galeri" hissi verir: tam görünüm, yakın detay, açılı, paketlenmiş.
 */
const VIEWS = [
  { scale: 7.4, x: 130, y: 220, rotate: 0, label: "önden görünüm" },
  { scale: 10.6, x: -60, y: 100, rotate: 0, label: "yakın detay" },
  { scale: 6.2, x: 190, y: 300, rotate: -8, label: "açılı görünüm" },
  { scale: 5.4, x: 230, y: 360, rotate: 6, label: "paket içeriği" },
];

function productSvg({ accent, categoryId, index, alt }) {
  const view = VIEWS[index % VIEWS.length];
  const glyph = GLYPHS[categoryId](accent);
  const w = 1000;
  const h = 1250;
  // Her görselde zemin tonu hafifçe değişsin ki galeri tek düze durmasın
  const bgTop = index % 2 === 0 ? SURFACE : "#EFEEE5";

  const safeAlt = xmlEscape(alt);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${safeAlt}">
  <title>${safeAlt}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bgTop}"/>
      <stop offset="1" stop-color="${SURFACE_2}"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.42" r="0.62">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <g opacity="0.35">
    ${topoLines(0.42)}
  </g>
  <rect width="${w}" height="${h}" fill="url(#halo)"/>
  <g transform="translate(${view.x} ${view.y}) rotate(${view.rotate} ${(100 * view.scale) / 2} ${(100 * view.scale) / 2}) scale(${view.scale})">
    ${glyph}
  </g>
</svg>
`;
}

function categorySvg({ accent, categoryId, name }) {
  const w = 900;
  const h = 600;
  const glyph = GLYPHS[categoryId](accent);
  const safeName = xmlEscape(name);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${safeName} kategorisi">
  <title>${safeName}</title>
  <defs>
    <linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${SURFACE}"/>
      <stop offset="1" stop-color="${SURFACE_2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#cbg)"/>
  <g opacity="0.4" transform="translate(-50 -420) scale(0.9)">
    ${topoLines(0.5)}
  </g>
  <g transform="translate(300 90) scale(4.2)">
    ${glyph}
  </g>
</svg>
`;
}

/** Hero ve footer'daki tekrar eden topografya deseni. */
function topoPatternSvg() {
  const paths = [];
  for (let i = 0; i < 7; i++) {
    const y = 40 + i * 52;
    paths.push(
      `<path d="M0 ${y} C 90 ${y - 34}, 190 ${y + 34}, 300 ${y} S 520 ${y - 34}, 720 ${y}" fill="none" stroke="${INK}" stroke-width="1.2" opacity="0.5"/>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" width="720" height="400">
  ${paths.join("\n  ")}
</svg>
`;
}

// ------------------------------------------------------------------- ÇALIŞTIR

mkdirSync(`${publicDir}/products`, { recursive: true });
mkdirSync(`${publicDir}/categories`, { recursive: true });
mkdirSync(`${publicDir}/pattern`, { recursive: true });

let productFiles = 0;
for (const product of products) {
  // Ürünün ilk renk varyantı varsa onu aksan yap, yoksa kategori rengini kullan
  const colorVariant = product.variants.find((v) => v.kind === "color" && v.swatch);
  const accent = colorVariant?.swatch ?? CATEGORY_ACCENT[product.categoryId];

  product.images.forEach((imagePath, index) => {
    const alt = `${product.name} - ${VIEWS[index % VIEWS.length].label}`;
    const svg = productSvg({
      accent,
      categoryId: product.categoryId,
      index,
      alt,
    });
    writeFileSync(resolve(publicDir, "..", "..", "public", imagePath.slice(1)), svg, "utf8");
    productFiles++;
  });
}

for (const category of categories) {
  const svg = categorySvg({
    accent: CATEGORY_ACCENT[category.id],
    categoryId: category.id,
    name: category.name,
  });
  writeFileSync(
    resolve(publicDir, "..", "..", "public", category.image.slice(1)),
    svg,
    "utf8",
  );
}

writeFileSync(resolve(publicDir, "pattern", "topo.svg"), topoPatternSvg(), "utf8");

console.log(
  `${productFiles} ürün görseli, ${categories.length} kategori görseli ve topo deseni üretildi.`,
);
