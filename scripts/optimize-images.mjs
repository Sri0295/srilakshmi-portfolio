/**
 * Generates optimized portfolio image assets from the owner-supplied photograph
 * and builds the Open Graph social preview image.
 *
 * Usage: npm run assets   (requires `sharp`, installed as a dev dependency)
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const imgDir = path.join(root, 'public', 'images')
const source = path.join(root, 'assets-source', 'profile-source.jpg')

async function run() {
  const meta = await sharp(source).metadata()
  console.log(`Source photo: ${meta.width}x${meta.height}`)

  // Portrait (hero + about) — 4:5, attention-based crop keeps the face framed.
  await sharp(source)
    .resize(1100, 1375, { fit: 'cover', position: sharp.strategy.attention })
    .webp({ quality: 82 })
    .toFile(path.join(imgDir, 'profile-portrait.webp'))

  // Square crop (cards, recruiter view).
  await sharp(source)
    .resize(1000, 1000, { fit: 'cover', position: sharp.strategy.attention })
    .webp({ quality: 82 })
    .toFile(path.join(imgDir, 'profile-square.webp'))

  // Small avatar.
  await sharp(source)
    .resize(320, 320, { fit: 'cover', position: sharp.strategy.attention })
    .webp({ quality: 78 })
    .toFile(path.join(imgDir, 'profile-avatar.webp'))

  // Open Graph 1200x630 social preview.
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#17152B"/>
        <stop offset="1" stop-color="#28204A"/>
      </linearGradient>
      <radialGradient id="blob1" cx="0.85" cy="0.15" r="0.55">
        <stop offset="0" stop-color="#956BFF" stop-opacity="0.75"/>
        <stop offset="1" stop-color="#956BFF" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="blob2" cx="0.1" cy="0.95" r="0.5">
        <stop offset="0" stop-color="#FF6B88" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#FF6B88" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="blob3" cx="0.65" cy="1.05" r="0.45">
        <stop offset="0" stop-color="#48DCCF" stop-opacity="0.4"/>
        <stop offset="1" stop-color="#48DCCF" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="text" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#F5F0FF"/>
        <stop offset="0.6" stop-color="#C5B5FF"/>
        <stop offset="1" stop-color="#FFBC91"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#blob1)"/>
    <rect width="1200" height="630" fill="url(#blob2)"/>
    <rect width="1200" height="630" fill="url(#blob3)"/>
    <g font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif">
      <text x="90" y="200" font-size="26" font-weight="600" letter-spacing="10" fill="#48DCCF">SOFTWARE ENGINEER</text>
      <text x="84" y="330" font-size="104" font-weight="700" fill="url(#text)">SRILAKSHMI S</text>
      <text x="90" y="415" font-size="30" fill="#C5B5FF">Python · Full Stack · Machine Learning · Computer Vision</text>
      <rect x="90" y="470" width="220" height="6" rx="3" fill="#FF6B88"/>
      <rect x="330" y="470" width="120" height="6" rx="3" fill="#48DCCF"/>
      <rect x="470" y="470" width="60" height="6" rx="3" fill="#D7F36A"/>
      <text x="90" y="545" font-size="24" fill="#8B84B8">deekshud881@gmail.com   ·   github.com/Sri0295   ·   linkedin.com/in/srilakshmi-s</text>
    </g>
  </svg>`

  await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(path.join(imgDir, 'og.png'))
  console.log('Generated: profile-portrait.webp, profile-square.webp, profile-avatar.webp, og.png')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
