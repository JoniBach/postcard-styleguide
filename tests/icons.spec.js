// Icons: every symbol in the sprite is real (parsed, not text inside a comment) and draws something.
// Matching the file's text isn't enough: an icon pasted inside the comment still matches.
import { test, expect } from '@playwright/test';

test('every icon in the sprite parses and draws', async ({ page }) => {
	await page.goto('/');
	const result = await page.evaluate(async () => {
		const text = await (await fetch('icons/icons.svg')).text();
		const named = [...text.matchAll(/<symbol id="pc-([\w-]+)"/g)].map((m) => m[1]);
		const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
		const parsed = [...doc.querySelectorAll('symbol')].map((s) => s.id.replace(/^pc-/, ''));
		const blank = [];
		for (const sym of doc.querySelectorAll('symbol')) {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 24 24');
			svg.style.cssText = 'position:absolute;width:24px;height:24px';
			svg.innerHTML = sym.innerHTML;
			document.body.append(svg);
			const box = svg.getBBox();
			if (!(box.width > 0 || box.height > 0)) blank.push(sym.id);
			svg.remove();
		}
		return { named, parsed, blank };
	});
	expect(result.parsed).toEqual(result.named);
	expect(result.blank).toEqual([]);
	expect(result.parsed.length).toBeGreaterThanOrEqual(48);
});
