/**
 * Generates the social share card public/assets/og-cover.jpg at exactly 1200x630.
 * Run: node tasks/gen-og.mjs
 */
import puppeteer from "puppeteer";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Caveat:wght@600;700&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  .card {
    width: 1200px; height: 630px; position: relative; overflow: hidden;
    background:
      radial-gradient(1100px 700px at 88% 18%, rgba(232,168,73,0.30), transparent 60%),
      linear-gradient(135deg, #FFF5E6 0%, #FFFBF5 45%, #F3E2CC 100%);
    font-family: 'Nunito', sans-serif; color: #3D2914;
    display: flex; align-items: center;
  }
  .wheat-line { position: absolute; inset: 0 0 auto 0; height: 8px;
    background: linear-gradient(90deg, #8B5A2B, #E8A849, #8B5A2B); }
  .left { padding: 0 0 0 80px; width: 660px; }
  .kicker { font-family:'Nunito'; font-weight:800; letter-spacing:.18em; text-transform:uppercase;
    font-size: 26px; color:#8B5A2B; margin-bottom: 14px; }
  .title { font-family:'Playfair Display', serif; font-weight:700; font-size: 92px; line-height:1.02;
    color:#5D3A1A; margin-bottom: 18px; }
  .sub { font-size: 33px; line-height:1.35; color:#6B4C2F; font-weight:600; max-width: 560px; margin-bottom: 30px; }
  .pill { display:inline-block; background: linear-gradient(135deg,#8B5A2B,#5D3A1A); color:#FFF5E6;
    font-weight:800; font-size: 26px; padding: 16px 30px; border-radius: 100px;
    box-shadow: 0 10px 28px rgba(139,90,43,.35); }
  .right { position:absolute; right: 70px; top: 50%; transform: translateY(-50%); }
  .url { position:absolute; left:80px; bottom: 44px; font-family:'Caveat'; font-weight:700;
    font-size: 34px; color:#8B5A2B; }
  .jar { filter: drop-shadow(0 18px 40px rgba(93,58,26,.28)); }
</style>
</head>
<body>
  <div class="card">
    <div class="wheat-line"></div>
    <div class="left">
      <div class="kicker">Sourdough, made simple</div>
      <div class="title">Rise &amp; Ferment</div>
      <div class="sub">Your sourdough journey starts here — daily guidance for busy beginners.</div>
      <div class="pill">Free 14-day starter guide</div>
    </div>
    <div class="right">
      <svg class="jar" width="320" height="440" viewBox="0 0 80 110" fill="none">
        <rect x="15" y="0" width="50" height="12" rx="3" fill="#8B5A2B"/>
        <rect x="18" y="2" width="44" height="3" fill="#A67C52"/>
        <rect x="12" y="10" width="56" height="6" rx="2" fill="#6B4423"/>
        <path d="M15 16 L12 100 Q12 108 20 108 L60 108 Q68 108 68 100 L65 16 Z"
          fill="rgba(255,255,255,0.55)" stroke="#C4956A" stroke-width="1.5"/>
        <path d="M18 20 L16 95 Q16 98 18 98 L22 98 Q24 98 24 95 L26 20 Z" fill="rgba(255,255,255,0.6)"/>
        <path d="M16 78 Q25 73 40 75 Q55 77 64 78 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z"
          fill="#D4A574" opacity="0.85"/>
        <circle cx="27" cy="86" r="2.4" fill="rgba(255,255,255,0.7)"/>
        <circle cx="40" cy="89" r="3" fill="rgba(255,255,255,0.6)"/>
        <circle cx="53" cy="84" r="2" fill="rgba(255,255,255,0.7)"/>
        <rect x="10" y="66" width="60" height="3" rx="1.5" fill="#E8A849" opacity="0.85"/>
      </svg>
    </div>
    <div class="url">riseandferment.com</div>
  </div>
</body>
</html>`;

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
  try { await page.evaluate(() => document.fonts.ready); } catch { /* fonts best-effort */ }
  await page.screenshot({ path: "public/assets/og-cover.jpg", type: "jpeg", quality: 88 });
  console.log("Wrote public/assets/og-cover.jpg (1200x630)");
} finally {
  await browser.close();
}
