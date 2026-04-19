import DottedMap from 'dotted-map';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const map = new DottedMap({ height: 100, grid: 'diagonal' });
const svg = map.getSVG({
    radius: 0.22,
    color: '#FFFFFF30',
    shape: 'circle',
    backgroundColor: 'transparent',
});

writeFileSync(resolve(__dirname, 'assets/svg/world-dots.svg'), svg);
console.log('saved world-dots.svg (' + svg.length + ' bytes)');
