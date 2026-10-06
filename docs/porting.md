# Porting Postcard

Postcard is vanilla on purpose: classes on HTML and custom properties in CSS. A framework only needs to load the stylesheet once and
write the same markup. Below, the same postcard in each framework, then Tailwind and platforms without CSS.

Load the CSS once, at the app's root:

```js
import '@jonibach/postcard/postcard.min.css'; // the bundled CSS; a bundler copies the fonts it points to
```

## Plain HTML (the reference)

```html
<a class="pc-postcard" href="/day/1" style="--pc-c: #d97757">
	<span class="pc-postcard__art">
		<img src="/photos/day-1.jpg" alt="" />
		<span class="pc-stamp pc-stamp--solid"><small>Day</small>1</span>
	</span>
	<span class="pc-postcard__body">
		<span class="pc-postcard__meta">Wed 9 Sept</span>
		<span class="pc-postcard__title pc-display">Setting off</span>
	</span>
</a>
```

## React

```jsx
import { dayColor } from '@jonibach/postcard/js';

export function DayPostcard({ day, total, href, photo, date, title, current }) {
	return (
		<a className="pc-postcard" href={href} aria-current={current ? 'page' : undefined} style={{ '--pc-c': dayColor(day - 1, total) }}>
			<span className="pc-postcard__art">
				{photo && <img src={photo} alt="" />}
				<span className="pc-stamp pc-stamp--solid"><small>Day</small>{day}</span>
			</span>
			<span className="pc-postcard__body">
				<span className="pc-postcard__meta">{date}</span>
				<span className="pc-postcard__title pc-display">{title}</span>
			</span>
		</a>
	);
}
```

Toasts and the theme are plain functions, so call them from event handlers or an effect:

```jsx
import { toast, restoreTheme } from '@jonibach/postcard/js';
useEffect(() => void restoreTheme(), []);
<button className="pc-button pc-button--primary" onClick={() => toast('Saved', { tone: 'success' })}>Save</button>
```

## Svelte

```svelte
<script>
	import { dayColor } from '@jonibach/postcard/js';
	let { day, total, href, photo, date, title, current = false } = $props();
</script>

<a class="pc-postcard" {href} aria-current={current ? 'page' : undefined} style:--pc-c={dayColor(day - 1, total)}>
	<span class="pc-postcard__art">
		{#if photo}<img src={photo} alt="" />{/if}
		<span class="pc-stamp pc-stamp--solid"><small>Day</small>{day}</span>
	</span>
	<span class="pc-postcard__body">
		<span class="pc-postcard__meta">{date}</span>
		<span class="pc-postcard__title pc-display">{title}</span>
	</span>
</a>
```

## Vue

```vue
<script setup>
import { dayColor } from '@jonibach/postcard/js';
const props = defineProps(['day', 'total', 'href', 'photo', 'date', 'title', 'current']);
</script>

<template>
	<a class="pc-postcard" :href="href" :aria-current="current ? 'page' : undefined" :style="{ '--pc-c': dayColor(day - 1, total) }">
		<span class="pc-postcard__art">
			<img v-if="photo" :src="photo" alt="" />
			<span class="pc-stamp pc-stamp--solid"><small>Day</small>{{ day }}</span>
		</span>
		<span class="pc-postcard__body">
			<span class="pc-postcard__meta">{{ date }}</span>
			<span class="pc-postcard__title pc-display">{{ title }}</span>
		</span>
	</a>
</template>
```

## Tailwind

Point Tailwind's theme at the custom properties, so utilities follow the theme (Paper, Dusk, Night) with no extra work. Keep
loading `css/tokens.css` (or the whole bundle) for the values.

```js
// tailwind.config.js
const v = (name) => `var(--pc-${name})`;
export default {
	theme: {
		extend: {
			colors: {
				paper: v('paper'), card: v('card'), sunk: v('sunk'),
				ink: v('ink'), muted: v('muted'), line: v('line'),
				accent: { DEFAULT: v('accent'), ink: v('accent-ink'), soft: v('accent-soft') },
				sage: { DEFAULT: v('sage'), ink: v('sage-ink') },
				sky: { DEFAULT: v('sky'), ink: v('sky-ink') },
				butter: { DEFAULT: v('butter'), ink: v('butter-ink') },
				lilac: { DEFAULT: v('lilac'), ink: v('lilac-ink') },
				rose: { DEFAULT: v('rose'), ink: v('rose-ink') }
			},
			fontFamily: { display: v('font-display'), ui: v('font-ui') },
			borderRadius: { sm: v('radius-sm'), DEFAULT: v('radius'), lg: v('radius-lg') },
			boxShadow: { press: v('press'), DEFAULT: v('shadow') },
			rotate: { tilt: v('tilt') }
		}
	}
};
```

On Tailwind v4, the same mapping goes in CSS with `@theme inline { --color-paper: var(--pc-paper); … }`.

The classes and utilities mix freely: `<button class="pc-button pc-button--primary mt-4">`.

## Web components and shadow DOM

Custom properties pass into shadow roots, but class rules don't. Inside a shadow root, adopt the stylesheet:

```js
const sheet = new CSSStyleSheet();
sheet.replaceSync(await (await fetch('https://cdn.jsdelivr.net/npm/@jonibach/postcard@0.2/dist/postcard.css')).text());
this.shadowRoot.adoptedStyleSheets = [sheet];
```

Note that `@font-face` only takes effect from the document, so load the bundle on the page as well.

## Native apps and design tools: tokens.json

`npm run build` writes `dist/tokens.json`: every token, resolved, for each theme.

```json
{ "light": { "paper": "#fbf6ec", "ink": "#263238", "accent": "#c2562d", "radius": "20px", "tilt": "-4deg", … },
  "dusk": { … }, "night": { … } }
```

Map it onto SwiftUI `Color`s, Compose `ColorScheme`s or Figma variables. `css/tokens.css` stays the source of truth:
change it there and rebuild.

## Changing the look

1. Edit `css/tokens.css`. Keep the two Dusk blocks identical (`npm run check` tells you if they drift).
2. Run `npm run check`. Every text pair must still pass.
3. Run `npm run dev` and look through the style guide in all three themes.
4. Run `npm run build` for `dist/`.
