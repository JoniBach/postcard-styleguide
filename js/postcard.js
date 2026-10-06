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

/**
 * Tabs with the keyboard behaviour people expect: one tab stop for the whole list, arrow keys
 * (and Home/End) move between tabs and show each one's panel.
 * Markup: a role="tablist" (e.g. .pc-segmented) of <button role="tab" aria-controls="panel-id">,
 * and role="tabpanel" elements with those ids (aria-labelledby the tab's id).
 * @param {HTMLElement} list the tablist
 * @returns {(index: number) => void} selects a tab by index
 */
export function tabs(list) {
	const all = () => [...list.querySelectorAll('[role="tab"]')];
	const select = (i, focus = false) => {
		const items = all();
		const next = items[(i + items.length) % items.length];
		for (const t of items) {
			const on = t === next;
			t.setAttribute('aria-selected', String(on));
			t.tabIndex = on ? 0 : -1;
			const panel = document.getElementById(t.getAttribute('aria-controls') ?? '');
			if (panel) panel.hidden = !on;
		}
		if (focus) next.focus();
	};
	list.addEventListener('click', (e) => {
		const tab = e.target instanceof Element && e.target.closest('[role="tab"]');
		if (tab) select(all().indexOf(tab));
	});
	list.addEventListener('keydown', (e) => {
		const items = all();
		const at = items.indexOf(document.activeElement);
		if (at < 0) return;
		const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: items.length - 1 }[e.key];
		if (to === undefined) return;
		e.preventDefault();
		select(to, true);
	});
	const current = all().findIndex((t) => t.getAttribute('aria-selected') === 'true');
	select(Math.max(0, current));
	return (i) => select(i);
}

/**
 * A button that opens a menu (.pc-menu) of links or buttons. Opens on click, Enter, Space or
 * ArrowDown; arrow keys move through the items; Esc, Tab or a click elsewhere closes it, and focus
 * returns to the button. The button needs aria-controls naming the menu, which starts hidden.
 * @param {HTMLButtonElement} button
 * @returns {{ open: () => void, close: () => void }}
 */
export function menuButton(button) {
	const menu = document.getElementById(button.getAttribute('aria-controls') ?? '');
	if (!menu) throw new Error('menuButton: aria-controls must name the menu');
	const items = () => [...menu.querySelectorAll('a[href], button:not(:disabled)')];
	button.setAttribute('aria-expanded', 'false');
	const onOutside = (e) => {
		if (!menu.contains(e.target) && !button.contains(e.target)) close(false);
	};
	function open(focusLast = false) {
		menu.hidden = false;
		button.setAttribute('aria-expanded', 'true');
		const list = items();
		(focusLast ? list.at(-1) : list[0])?.focus();
		document.addEventListener('pointerdown', onOutside);
	}
	function close(refocus = true) {
		menu.hidden = true;
		button.setAttribute('aria-expanded', 'false');
		document.removeEventListener('pointerdown', onOutside);
		if (refocus) button.focus();
	}
	button.addEventListener('click', () => (menu.hidden ? open() : close()));
	button.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			open(e.key === 'ArrowUp');
		}
	});
	menu.addEventListener('keydown', (e) => {
		const list = items();
		const at = list.indexOf(document.activeElement);
		const to = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: list.length - 1 }[e.key];
		if (to !== undefined) {
			e.preventDefault();
			list[(to + list.length) % list.length]?.focus();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			close();
		} else if (e.key === 'Tab') close(false);
	});
	menu.addEventListener('click', (e) => {
		if (e.target instanceof Element && e.target.closest('a[href], button')) close();
	});
	return { open: () => open(), close: () => close() };
}

/**
 * Show an error summary (.pc-error-summary): focus it so it's announced first, and make each link
 * move focus into its field (scrolling the field's label into view, not just the input).
 * @param {HTMLElement} el
 */
export function errorSummary(el) {
	el.hidden = false;
	if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
	el.focus();
	// listen once, however many times the form is submitted
	if (el.dataset.pcBound) return;
	el.dataset.pcBound = 'true';
	el.addEventListener('click', (e) => {
		const link = e.target instanceof Element && e.target.closest('a[href^="#"]');
		if (!link) return;
		const field = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
		if (!field) return;
		e.preventDefault();
		const label = field.closest('fieldset')?.querySelector('legend') ?? document.querySelector(`label[for="${CSS.escape(field.id)}"]`);
		(label ?? field).scrollIntoView({ block: 'start' });
		field.focus({ preventScroll: true });
	});
}

/**
 * Add "Show all" / "Hide all" above an accordion (.pc-accordion of <details>), kept in step as
 * sections open and close.
 * @param {HTMLElement} el
 */
export function accordion(el) {
	const sections = [...el.querySelectorAll(':scope > details')];
	const bar = document.createElement('div');
	bar.className = 'pc-accordion__controls';
	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'pc-button pc-button--ghost pc-button--sm';
	bar.append(button);
	el.before(bar);
	const sync = () => {
		const allOpen = sections.every((d) => d.open);
		button.textContent = allOpen ? 'Hide all sections' : 'Show all sections';
		button.setAttribute('aria-expanded', String(allOpen));
	};
	button.addEventListener('click', () => {
		const open = !sections.every((d) => d.open);
		for (const d of sections) d.open = open;
		sync();
	});
	for (const d of sections) d.addEventListener('toggle', sync);
	sync();
}
