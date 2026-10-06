// Visual: a screenshot of every section, in Paper and Dusk, compared with the saved ones. Fonts
// render differently on each OS, so these run locally (npm run test:visual), not in CI; after an
// intended change, npm run test:visual:update saves new ones. @visual tags them.
import { test, expect } from '@playwright/test';

const SECTIONS = ['colour', 'type', 'icons', 'buttons', 'navigation', 'tags', 'forms', 'cards', 'tables', 'disclosure', 'summaries', 'photos', 'charts', 'feedback', 'night'];

for (const scheme of ['light', 'dark']) {
	test.describe(`${scheme === 'light' ? 'Paper' : 'Dusk'} @visual`, () => {
		test.beforeEach(async ({ page }) => {
			await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
			await page.goto('/');
			await page.locator('.sg-guide').first().waitFor();
			await page.evaluate(() => document.fonts.ready);
			// the sticky bar would otherwise land on top of whichever section is being shot
			await page.addStyleTag({ content: '.pc-topbar { position: static !important; }' });
		});
		for (const id of SECTIONS) {
			test(id, async ({ page }) => {
				await expect(page.locator(`#${id}`)).toHaveScreenshot(`${id}-${scheme}.png`);
			});
		}
	});
}
