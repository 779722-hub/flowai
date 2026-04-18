// Generate inline SVG with 36 animated paths that matches the motion/react FloatingPaths behaviour.
// position = -1 (as in the demo).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const position = -1;
const count = 36;

const paths = Array.from({ length: count }, (_, i) => {
    const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
    const width = (0.5 + i * 0.03).toFixed(2);
    const opacity = (0.1 + i * 0.03).toFixed(3);
    const dur = (20 + Math.random() * 10).toFixed(1);
    // Dash travels along the path via dashoffset animation; pathLength=1 keeps units in 0-1 range
    return `<path pathLength="1" d="${d}" stroke="currentColor" stroke-width="${width}" stroke-opacity="${opacity}" fill="none" stroke-dasharray="0.3 0.7" stroke-dashoffset="0">
    <animate attributeName="stroke-dashoffset" values="0;-1" dur="${dur}s" repeatCount="indefinite"/>
    <animate attributeName="stroke-opacity" values="${(parseFloat(opacity) * 0.5).toFixed(3)};${opacity};${(parseFloat(opacity) * 0.5).toFixed(3)}" dur="${dur}s" repeatCount="indefinite"/>
  </path>`;
}).join('\n  ');

const svg = `<svg class="floating-paths" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  ${paths}
</svg>`;

fs.writeFileSync(path.resolve(__dirname, '..', 'assets', 'svg', 'floating-paths.svg'), svg);

// Also output just the inner paths as a string for pasting
const inner = paths;
fs.writeFileSync(path.resolve(__dirname, 'floating-paths-inner.html'), `<!-- paste inside an <svg viewBox="0 0 696 316"> -->\n${inner}`);

console.log('wrote assets/svg/floating-paths.svg and scripts/floating-paths-inner.html');
