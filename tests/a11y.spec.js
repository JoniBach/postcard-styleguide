// Accessibility: axe (WCAG 2.2 A and AA rules) over the whole style guide, in each theme, with
// every "Guidance and code" panel open, and again with the dialog and the lightbox open.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function audit(page) {
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
	// one line per problem, so a failure says what to fix
	return violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')} (${n.failureSummary?.split('\n')[1]?.trim() ?? v.help})`));
}

for (const scheme of ['light', 'dark']) {
	test(`the whole page passes axe (${scheme === 'light' ? 'Paper' : 'Dusk'})`, async ({ page }) => {
		await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
		await page.goto('/');
		await page.locator('.sg-guide').first().waitFor();
		await page.evaluate(() => document.querySelectorAll('.sg-guide').forEach((d) => (d.open = true)));
		expect(await audit(page)).toEqual([]);
	});
}

test('the dialog passes axe', async ({ page }) => {
	await page.goto('/');
	await page.click('#open-dialog');
	expect(await audit(page)).toEqual([]);
});

test('the lightbox passes axe', async ({ page }) => {
	await page.goto('/');
	await page.click('#gallery li:first-child a');
	expect(await audit(page)).toEqual([]);
});
