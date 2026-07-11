// Generates public/og-image.png (1200x630) from an inline SVG via sharp.
// Run: node scripts/generate-og-image.mjs
import sharp from 'sharp';

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#05060f"/>
      <stop offset="0.55" stop-color="#020308"/>
      <stop offset="1" stop-color="#05060f"/>
    </linearGradient>
    <radialGradient id="glowCyan" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#00f7ff" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#00f7ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowBlue" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#3b6fff" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#3b6fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#00f7ff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#00f7ff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity="0.05"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <circle cx="1080" cy="40" r="420" fill="url(#glowCyan)"/>
  <circle cx="120" cy="600" r="380" fill="url(#glowBlue)"/>

  <rect x="64" y="64" width="${W - 128}" height="${H - 128}" rx="20"
        fill="rgba(8,10,24,0.55)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>

  <g font-family="Open Sans, Helvetica Neue, Arial, sans-serif">
    <text x="128" y="196" font-size="24" font-weight="600" letter-spacing="7"
          fill="#00f7ff">ELECTRICAL ENGINEER · EGBC EIT</text>

    <text x="128" y="292" font-size="86" font-weight="700"
          fill="#f5f7fa">Andrew Manson</text>

    <rect x="130" y="330" width="520" height="3" fill="url(#rule)"/>

    <text x="128" y="404" font-size="31" font-weight="400"
          fill="#c3cad6">Machine Vision  |  Embedded Systems  |  Open-Source AI</text>

    <text x="128" y="486" font-size="28" font-weight="700"
          fill="#7ddfff">jandrewmanson.engineer</text>

    <text x="128" y="528" font-size="22" font-weight="400"
          fill="#8b93a5">linkedin.com/in/jandrewmanson  |  github.com/jamubc</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('wrote public/og-image.png');
