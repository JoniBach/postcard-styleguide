// Postcard's small helpers: plain ES modules, no dependencies, nothing runs on import. Each one
// works on ordinary DOM, so a framework can call them from its own lifecycle (onMount, useEffect)
// or replace them with its own version.
//   import { setTheme, toast, dayColor, sheet } from './js/postcard.js';

const THEME_KEY = 'pc-theme';

/**
 * Pin the page to a theme, or follow the OS ('system'). Remembered in this browser.
 * @param {'light' | 'dusk' | 'system'} theme
 */
export function setTheme(theme) {
	const root = document.documentElement;
	if (theme === 'system') root.removeAttribute('data-theme');
	else root.setAttribute('data-theme', theme);
	try {
		if (theme === 'system') localStorage.removeItem(THEME_KEY);
		else localStorage.setItem(THEME_KEY, theme);
	} catch {
		// storage blocked: the choice lasts for this page only
	}
}

/** The theme this browser chose before, applied at once (call it early, before first paint). */
export function restoreTheme() {
	let saved = null;
	try {
		saved = localStorage.getItem(THEME_KEY);
	} catch {
		// storage blocked
	}
	if (saved === 'light' || saved === 'dusk') document.documentElement.setAttribute('data-theme', saved);
	return saved ?? 'system';
}

/** The theme in effect right now, resolving 'system' through the OS setting. */
export function currentTheme() {
	const pinned = document.documentElement.getAttribute('data-theme');
	if (pinned === 'light') return 'light';
	if (pinned === 'dusk' || pinned === 'dark') return 'dusk';
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'dusk' : 'light';
}

/**
 * Show a toast at the bottom of the screen. It goes after `duration` ms, or when its action runs.
 * @param {string} message
 * @param {{ tone?: 'success' | 'danger', action?: { label: string, run: () => void }, duration?: number }} [options]
 * @returns {() => void} dismisses it early
 */
export function toast(message, { tone, action, duration = 4000 } = {}) {
	let shelf = document.querySelector('.pc-toasts');
	if (!shelf) {
		shelf = document.createElement('div');
		shelf.className = 'pc-toasts';
		shelf.setAttribute('aria-live', 'polite');
		document.body.append(shelf);
	}
	const el = document.createElement('div');
	el.className = `pc-toast${tone ? ` pc-toast--${tone}` : ''}`;
	el.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
	const text = document.createElement('span');
	text.textContent = message;
	el.append(text);

	let timer;
	const dismiss = () => {
		clearTimeout(timer);
		if (!el.isConnected || el.classList.contains('is-leaving')) return;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) return el.remove();
		el.classList.add('is-leaving');
		el.addEventListener('animationend', () => el.remove(), { once: true });
	};
	if (action) {
		const button = document.createElement('button');
		button.type = 'button';
		button.textContent = action.label;
		button.addEventListener('click', () => {
			action.run();
			dismiss();
		});
		el.append(button);
	}
	shelf.append(el);
	// pause while the pointer or focus is on it, so there's time to read and act
	const start = () => (timer = setTimeout(dismiss, duration));
	el.addEventListener('pointerenter', () => clearTimeout(timer));
	el.addEventListener('pointerleave', start);
	el.addEventListener('focusin', () => clearTimeout(timer));
	start();
	return dismiss;
}

/**
 * One colour per item of a sequence (days of a trip, chapters), spread round the hue wheel from
 * terracotta through sage and sky to lilac, stopping short of wrapping. Soft, but strong enough
 * for a line on paper. Set it as --pc-c on the item.
 * @param {number} index 0-based
 * @param {number} total
 * @returns {string} a hex colour
 */
export function dayColor(index, total) {
	const h = 12 + (index / Math.max(1, total - 1)) * 290;
	return hslToHex(h, 0.55, 0.55);
}

function hslToHex(h, s, l) {
	const k = (n) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
	return `#${[f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Open a bottom sheet (.pc-sheet, starts hidden) with its scrim. Esc, the scrim or any
 * [data-close] inside it closes it, and focus goes back where it was.
 * @param {HTMLElement} el the .pc-sheet
 * @returns {() => void} closes it
 */
export function sheet(el) {
	const back = document.activeElement;
	let scrim = el.previousElementSibling?.classList.contains('pc-scrim') ? el.previousElementSibling : null;
	if (!scrim) {
		scrim = document.createElement('div');
		scrim.className = 'pc-scrim';
		el.before(scrim);
	}
	const close = () => {
		el.hidden = true;
		scrim.hidden = true;
		document.removeEventListener('keydown', onKey);
		if (back instanceof HTMLElement) back.focus();
	};
	const onKey = (e) => e.key === 'Escape' && close();
	scrim.hidden = false;
	el.hidden = false;
	el.setAttribute('role', 'dialog');
	el.setAttribute('aria-modal', 'true');
	scrim.onclick = close;
	el.querySelectorAll('[data-close]').forEach((b) => (b.onclick = close));
	document.addEventListener('keydown', onKey);
	(el.querySelector('[autofocus], button, a, input') ?? el).focus({ preventScroll: true });
	return close;
}
