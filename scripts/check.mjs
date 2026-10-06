// Contrast check for every theme: the pairs a page actually puts together, against WCAG.
// AAA (7:1) for text the app promised AAA on; AA (4.5:1) for smaller supporting text; 3:1 for
// borders and controls that have to be seen. Exits non-zero on any failure.
//   npm run check
import { readTokens } from './tokens.mjs';

const t = readTokens();
let failures = 0;

if (!t.duskBlocksMatch) {
	console.error('✗ tokens.css: the two dusk blocks (the media query and [data-theme=dusk]) differ; keep them identical');
	failures++;
}

function parse(c) {
	c = c.trim();
	let m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
	if (m) {
		const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1];
		return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
	}
	m = c.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/);
	if (m) {
		const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
		return [+m[1], +m[2], +m[3], a];
	}
	if (c === '#fff' || c === 'white') return [255, 255, 255, 1];
	throw new Error(`can't read colour ${c}`);
}
/** a translucent colour, laid over an opaque one */
function over(top, under) {
	const [r, g, b, a] = top;
	return [r * a + under[0] * (1 - a), g * a + under[1] * (1 - a), b * a + under[2] * (1 - a), 1];
}
function luminance([r, g, b]) {
	const ch = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
	return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}
function ratio(fg, bg) {
	const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
	return (a + 0.05) / (b + 0.05);
}

function check(theme, fgName, bgName, min, base = 'paper') {
	const v = t[theme];
	const ground = parse(v[`--pc-${base}`]);
	const opaque = (name) => {
		const c = parse(v[`--pc-${name}`]);
		return c[3] < 1 ? over(c, ground) : c;
	};
	const bg = opaque(bgName);
	const fgRaw = parse(v[`--pc-${fgName}`]);
	const fg = fgRaw[3] < 1 ? over(fgRaw, bg) : fgRaw;
	const r = ratio(fg, bg);
	const ok = r >= min;
	if (!ok) failures++;
	console.log(`${ok ? '✓' : '✗'} ${theme.padEnd(5)} ${fgName.padEnd(12)} on ${bgName.padEnd(12)} ${r.toFixed(2).padStart(5)}:1  (needs ${min})`);
}

const AAA = 7;
const AA = 4.5;
const UI = 3;
for (const theme of ['light', 'dusk']) {
	console.log(`\n${theme}`);
	for (const bg of ['paper', 'card']) {
		check(theme, 'ink', bg, AAA);
		check(theme, 'muted', bg, AAA);
		check(theme, 'accent-ink', bg, AAA);
		check(theme, 'danger-ink', bg, AA);
	}
	check(theme, 'muted', 'sunk', AA);
	for (const p of ['sage', 'sky', 'butter', 'lilac', 'peach', 'rose']) check(theme, `${p}-ink`, p, AAA);
	check(theme, 'accent-ink', 'accent-soft', AAA);
	check(theme, 'on-accent', 'accent', AA);
	check(theme, 'paper', 'ink', AAA); // toasts, tooltips, pressed pills
	check(theme, 'line-strong', 'card', UI); // field borders
	check(theme, 'accent', 'paper', UI); // the accent as a shape: buttons, the rail's thread
	for (let i = 1; i <= 6; i++) check(theme, `chart-${i}`, 'paper', UI); // chart marks
	check(theme, 'div-1', 'paper', UI); // the ends of the diverging scale
	check(theme, 'div-5', 'paper', UI);
	check(theme, 'seq-5', 'paper', UI);
}
console.log('\nnight (over the dark scene)');
check('night', 'ink', 'card', AAA);
check('night', 'muted', 'card', AA);
check('night', 'accent', 'card', AAA);
check('night', 'on-accent', 'accent', AAA);

console.log(failures ? `\n${failures} failed` : '\nAll pairs pass');
process.exit(failures ? 1 : 0);
