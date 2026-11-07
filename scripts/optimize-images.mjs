/**
 * Builds the Open Graph social preview image (soft pink editorial palette).
 *
 * Usage: npm run assets   (requires `sharp`, installed as a dev dependency)
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const imgDir = path.join(root, 'public', 'images')

async function run() {
  // Open Graph 1200x630 social preview — soft pink editorial palette.
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FFF9F7"/>
        <stop offset="0.6" stop-color="#FBECEF"/>
        <stop offset="1" stop-color="#F6DCE3"/>
      </linearGradient>
      <radialGradient id="blob1" cx="0.9" cy="0.1" r="0.55">
        <stop offset="0" stop-color="#D895A7" stop-opacity="0.4"/>
        <stop offset="1" stop-color="#D895A7" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="blob2" cx="0.05" cy="1" r="0.5">
        <stop offset="0" stop-color="#AD647C" stop-opacity="0.22"/>
        <stop offset="1" stop-color="#AD647C" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="text" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#514047"/>
        <stop offset="0.65" stop-color="#AD647C"/>
        <stop offset="1" stop-color="#D895A7"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#blob1)"/>
    <rect width="1200" height="630" fill="url(#blob2)"/>
    <g font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif">
      <text x="90" y="200" font-size="26" font-weight="600" letter-spacing="10" fill="#AD647C">SOFTWARE ENGINEER</text>
      <text x="84" y="330" font-size="104" font-weight="700" fill="url(#text)">SRILAKSHMI S</text>
      <text x="90" y="415" font-size="30" fill="#897B80">Python · Full Stack · Machine Learning · Computer Vision</text>
      <rect x="90" y="470" width="220" height="6" rx="3" fill="#D895A7"/>
      <rect x="330" y="470" width="120" height="6" rx="3" fill="#AD647C"/>
      <rect x="470" y="470" width="60" height="6" rx="3" fill="#E7BFC9"/>
      <text x="90" y="545" font-size="24" fill="#897B80">deekshud881@gmail.com   ·   github.com/Sri0295   ·   linkedin.com/in/srilakshmi-s</text>
    </g>
  </svg>`

  await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(path.join(imgDir, 'og.png'))
  console.log('Generated: og.png')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
