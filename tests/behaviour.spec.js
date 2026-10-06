// Behaviour: the keyboard paths and helpers work the way the guidance says they do.
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
	await page.locator('.sg-guide').first().waitFor();
});

test('the skip link is the first tab stop and moves focus to the main content', async ({ page }) => {
	await page.keyboard.press('Tab');
	await expect(page.locator('.pc-skip-link')).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator('#main')).toBeFocused();
});

test('tabs: one tab stop, arrow keys and End switch tabs and panels', async ({ page }) => {
	await page.focus('#tab-ride');
	await page.keyboard.press('ArrowRight');
	await expect(page.locator('#tab-weather')).toBeFocused();
	await expect(page.locator('#tab-weather')).toHaveAttribute('aria-selected', 'true');
	await expect(page.locator('#panel-weather')).toBeVisible();
	await expect(page.locator('#panel-ride')).toBeHidden();
	await expect(page.locator('#tab-ride')).toHaveAttribute('tabindex', '-1');
	await page.keyboard.press('End');
	await expect(page.locator('#tab-music')).toBeFocused();
	await page.keyboard.press('ArrowRight');
	await expect(page.locator('#tab-ride')).toBeFocused();
});

test('menu button: ↓ opens it, arrows move, Esc closes and refocuses the button', async ({ page }) => {
	const button = page.locator('#day-menu-button');
	await button.focus();
	await page.keyboard.press('ArrowDown');
	await expect(page.locator('#day-menu')).toBeVisible();
	await expect(button).toHaveAttribute('aria-expanded', 'true');
	await expect(page.locator('#day-menu a').first()).toBeFocused();
	await page.keyboard.press('ArrowUp');
	await expect(page.locator('#day-menu a').last()).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(page.locator('#day-menu')).toBeHidden();
	await expect(button).toBeFocused();
});

test('error summary: lists every problem, takes focus, and its links go to the fields', async ({ page }) => {
	await page.click('#err-form button[type=submit]');
	const summary = page.locator('#err-summary');
	await expect(summary).toBeFocused();
	await expect(summary.locator('a')).toHaveText(['Enter your name', 'Enter an email address, like name@example.com']);
	await expect(page.locator('#e-name')).toHaveAttribute('aria-invalid', 'true');
	await summary.locator('a[href="#e-email"]').click();
	await expect(page.locator('#e-email')).toBeFocused();
	await page.fill('#e-name', 'James');
	await page.fill('#e-email', 'james@example.com');
	await page.click('#err-form button[type=submit]');
	await expect(summary).toBeHidden();
	await expect(page.locator('.pc-toast')).toContainText('Postcard sent');
});

test('accordion: "Show all sections" opens every section and changes to "Hide all"', async ({ page }) => {
	const toggle = page.locator('.pc-accordion__controls button');
	await expect(toggle).toHaveText('Show all sections');
	await toggle.click();
	await expect(page.locator('#faq details[open]')).toHaveCount(3);
	await expect(toggle).toHaveText('Hide all sections');
});

test('character count: counts down, then says how many too many', async ({ page }) => {
	const count = page.locator('#c-note-count');
	await page.fill('#c-note', 'x'.repeat(100));
	await expect(count).toHaveText('You have 20 characters remaining');
	await page.fill('#c-note', 'x'.repeat(121));
	await expect(count).toHaveText('You have 1 character too many');
	await expect(count).toHaveClass(/is-over/);
});

test('lightbox: opens on the photo, arrows move, Esc returns focus to it', async ({ page }) => {
	await page.click('#gallery li:nth-child(3) a');
	const box = page.locator('.pc-lightbox');
	await expect(box).toBeVisible();
	await expect(box.locator('.pc-lightbox__count')).toHaveText('3 of 8');
	await page.keyboard.press('ArrowRight');
	await expect(box.locator('.pc-lightbox__count')).toHaveText('4 of 8');
	await page.keyboard.press('ArrowLeft');
	await page.keyboard.press('ArrowLeft');
	await expect(box.locator('.pc-lightbox__count')).toHaveText('2 of 8');
	await page.keyboard.press('Escape');
	await expect(box).toBeHidden();
	await expect(page.locator('#gallery li:nth-child(3) a')).toBeFocused();
});

test('dialog: answers close it and say what happens next', async ({ page }) => {
	await page.click('#open-dialog');
	await expect(page.locator('#dialog')).toBeVisible();
	await page.locator('#dialog button[value="later"]').last().click();
	await expect(page.locator('#dialog')).toBeHidden();
	await expect(page.locator('.pc-toast')).toContainText("We'll ask again in a few days");
});

test('sheet: opens, Esc closes it and returns focus', async ({ page }) => {
	await page.click('#open-sheet');
	await expect(page.locator('#sheet')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.locator('#sheet')).toBeHidden();
	await expect(page.locator('#open-sheet')).toBeFocused();
});

test('theme: Dusk is remembered across a reload', async ({ page }) => {
	await page.click('[data-theme-choice="dusk"]');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dusk');
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dusk');
	await expect(page.locator('[data-theme-choice="dusk"]')).toHaveAttribute('aria-pressed', 'true');
});

test('nothing scrolls sideways on a phone', async ({ page }) => {
	await page.setViewportSize({ width: 360, height: 780 });
	await page.goto('/');
	await page.locator('.sg-guide').first().waitFor();
	expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('every snippet has a working Copy button', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.evaluate(() => (document.querySelector('#tables .sg-guide').open = true));
	await page.locator('#tables .sg-snippet button').click();
	const copied = await page.evaluate(() => navigator.clipboard.readText());
	expect(copied).toContain('<table class="pc-table">');
	expect(copied).not.toContain('data-example');
});
