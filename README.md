# Postcard

The look of the [Parks Tour](https://gt-retrospective.vercel.app/the-parks-26/), set aside as a style guide of its own: warm paper,
soft pastel fills, deep slate ink and one terracotta accent. Things are rounded, they lean a little, and they press down when you
touch them. The brief was **whimsy, playfulness and approachability**, without giving up readability: every text colour reaches
7:1 contrast (WCAG AAA) in every theme.

**See it live: https://jonibach.github.io/postcard-styleguide/**

It's plain CSS (custom properties and `pc-` classes) plus a few optional vanilla JS helpers, with no build step and no
dependencies. A React, Svelte, Vue or native app can use it as it is or port it piece by piece.

```sh
npm run dev           # the living style guide on http://localhost:4321
npm run check         # contrast check for every theme
npm run build         # dist/: one bundled CSS file, the fonts, the icons, the helpers and tokens.json
npm test              # behaviour and accessibility (axe, WCAG 2.2 AA) tests in Chromium; CI runs these
npm run test:visual   # screenshots of every section in Paper and Dusk, against the saved ones
```

Tests need a Chromium: `npx playwright install chromium`, or point `PW_EXECUTABLE_PATH` at Chrome, Brave or Edge.

## What makes it Postcard

- **One strong colour.** Terracotta marks the thing to do next and where you are. Everything else is paper, ink and pastels.
- **Things lean.** Stamps sit at −4°, cards lift and wobble a fraction of a degree when you reach for them, and the round mark
  tips its hat on hover. Use the tilt in a few places, not everywhere.
- **Pressable.** Buttons and pills sit on a short, hard 3px shadow and sink into it when pressed, like a key.
- **Postage stamps.** The signature piece: a scalloped edge drawn with a dotted border, a number in soft, wonky Fraunces, and a
  colour from the item it belongs to.
- **A sky that settles into paper.** Pages open with a pale blue gradient that fades into the paper colour.
- **Readable first.** AAA text contrast, 44px targets, visible focus, and no motion when the system asks for less.

## Using it

**In an app with a bundler** (SvelteKit, React, Vue, Astro, …):

```sh
npm install @jonibach/postcard
```

```js
import '@jonibach/postcard';                                  // dist/postcard.css; the bundler copies its fonts
import { setTheme, toast, dayColor } from '@jonibach/postcard/js';
```

Pin a version range that takes fixes but not breaking changes: `"@jonibach/postcard": "~0.2.1"` (before 1.0, a minor
version may rename things; see the changelog).

**On a plain HTML page**, straight from a CDN (the fonts load from the same place):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jonibach/postcard@0.2/dist/postcard.css" />
<script type="module">
	import { setTheme } from 'https://cdn.jsdelivr.net/npm/@jonibach/postcard@0.2/js/postcard.js';
</script>
```

**Without npm:** each [GitHub release](https://github.com/JoniBach/postcard-styleguide/releases) has a zip of `dist/`, ready to
link.

**Only the parts you need:** import single files from `@jonibach/postcard/css/…` (`tokens.css` is the only one the others
depend on), or read every token per theme from `@jonibach/postcard/tokens.json`.

### Releasing a version

1. Update `version` in `package.json` and add a section to `CHANGELOG.md`.
2. Merge to `main`, then publish a GitHub release tagged `v` plus the version (`v0.2.1`).
3. The Release workflow runs the tests and publishes to npm with provenance. There's no npm token: the repo is a trusted
   publisher for the package.

See [CHANGELOG.md](CHANGELOG.md) for what changed in each version.

It relies on modern CSS: custom properties, `color-mix()`, `:has()` and `<dialog>`, which means Safari 16.4+, Chrome/Edge 111+
and Firefox 121+ (all 2023 or later). Solid stamps also use relative colours (`oklch(from …)`, Chrome 119+, Safari 18+,
Firefox 128+) to stay readable on any colour; older browsers show the colour as given.

## What's inside

| File | What it holds |
| --- | --- |
| `css/tokens.css` | Every colour, font, size, space, radius, shadow, tilt and timing, as `--pc-*` custom properties, for three themes |
| `css/fonts.css` | Fraunces (SOFT, WONK and optical-size axes) and Figtree, self-hosted from `fonts/` |
| `css/base.css` | The page, type classes (`pc-h1`, `pc-eyebrow`, `pc-lede`, `pc-label`), `pc-prose` for long reading, focus, reduced motion |
| `css/components/button.css` | `pc-button` (primary, ink, soft, ghost; sm, lg, block; disabled, busy) and `pc-icon-button` |
| `css/components/pillbar.css` | `pc-topbar`, frosted `pc-pill`, `pc-brand` with `pc-mark`, `pc-segmented` (views, tabs, toggles), `pc-menu` |
| `css/components/chip.css` | `pc-tag` in each pastel, `pc-chip` toggle filters, `pc-badge`, `pc-dot` |
| `css/components/field.css` | `pc-field` with label, hint and error; `pc-input`, `pc-select`, `pc-textarea`, `pc-check`, `pc-switch`, `pc-slider`, `pc-knobs`; `pc-fieldset` and `pc-choices`, `pc-count`, `pc-file` and `pc-dropzone`, `pc-date`; `pc-error-summary` |
| `css/components/stamp.css` | `pc-stamp` (tinted, solid, outline; sm, lg; a "land" animation) and `pc-tile` |
| `css/components/card.css` | `pc-card`, `pc-postcard` (art, stamp, body), `pc-banner`, `pc-panel`, `pc-postcards` grid |
| `css/components/rail.css` | `pc-rail`, the journey rail: a thread through stamps, filled to where you are; `pc-rail--across` for phones |
| `css/components/feedback.css` | `pc-note` (info, success, warning, danger, tip), `pc-toast`, `data-tip` tooltips, `pc-progress`, `pc-spinner`, `pc-skeleton`, `pc-empty` |
| `css/components/overlay.css` | `pc-dialog` on the native `<dialog>`, `pc-sheet` (bottom sheet) and `pc-scrim` |
| `css/components/icon.css` | `pc-icon` (sm, lg) for the sprite in `icons/icons.svg`, and `pc-icon-disc`, an icon in a tilted tile |
| `css/components/wayfinding.css` | `pc-skip-link`, `pc-breadcrumbs`, `pc-back-link`, `pc-pagination` (previous and next), `pc-pages` (numbered) |
| `css/components/table.css` | `pc-table` in a scrolling `pc-table-wrap`: caption, numeric columns, a totals row, compact rows |
| `css/components/disclosure.css` | `pc-details` (one show-and-hide) and `pc-accordion` (stacked sections), both on native `<details>` |
| `css/components/summary.css` | `pc-summary` (label and value pairs; card and inline stats) and `pc-confirmation`, the "done" panel |
| `css/components/media.css` | `pc-figure` (and the tilted `--snapshot`), `pc-gallery`, and the `pc-lightbox` viewer |
| `css/components/footer.css` | `pc-footer`: link columns, headings and small print below a perforated edge |
| `css/print.css` | Print: black on white, no floating bars or buttons, every section open, cards kept whole |
| `css/forced-colors.css` | Windows Contrast themes: real borders where Postcard uses fills and shadows, system highlights for the current thing |
| `icons/icons.svg` | 42 icons on a 24px grid with 2px rounded strokes, as one sprite; a build also writes each one to `dist/icons/` |
| `css/utilities.css` | `pc-container`, `pc-stack`, `pc-cluster`, `pc-grid`, `pc-sr-only`, `pc-scroll-y/x`, `pc-perforation`, `pc-airmail`, `pc-tilt` |
| `js/postcard.js` | `setTheme` / `restoreTheme` / `currentTheme`, `toast`, `dayColor`, `sheet`, keyboard behaviour (`tabs`, `menuButton`, `errorSummary`, `accordion`), `charCount`, `lightbox` and `token`. Plain ES module, nothing runs on import |
| `index.html` | The living style guide: every token and component in every theme, with guidance and copyable code for each |
| `tests/` | Behaviour, accessibility (axe) and screenshot tests, run with Playwright |
| `docs/content.md` | How to write for it: voice, labels, errors, numbers, dates, alt text |
| `dist/tokens.json` | (built) every token per theme, resolved, for Tailwind, native apps or design tools |

### Themes

- **Paper** (light) is the default, on `:root`.
- **Dusk** (dark) follows the OS setting. `data-theme="light"` or `data-theme="dusk"` on `<html>` pins either one, and
  `setTheme()` does that and remembers it.
- **Night** is the 3D globe's hologram look for panels over a dark scene: add `pc-theme-night` to any container.

### A colour per item

Days of a trip, chapters and categories each get their own colour through one custom property, `--pc-c`. Stamps, postcards, tinted
tags, menu rows and the rail all take their tint from it. `dayColor(index, total)` spreads a sequence round the hue wheel from
terracotta through sage and sky to lilac:

```html
<a class="pc-postcard" href="/day/3" style="--pc-c: #96b04f">…</a>
```

## Gaps this fills in the app

The tour site had the theme but used it unevenly. This guide fills those gaps so the next app can start clean:

- **One token set instead of two.** The app had a root palette (`--paper`, `--ink`, …) and a separate blog palette
  (`--b-bg`, `--b-text`, …) with slightly different values. Here there's one set, prefixed `--pc-`.
- **No hard-coded colours.** The blog's pastel pills, the rail's terracotta thread, the header's mark and the white inputs all had
  literal hex values. All of those are tokens now, so they follow the theme.
- **A dark theme.** The app was light only, apart from the globe's night panels. **Dusk** is the same postcard after sundown and
  meets the same AAA contrast.
- **One button system.** The app had three button styles: rectangular accent buttons in the mailing-list forms, pills on a
  pressed shadow in the header, and the error page's raised pill. They're now one `pc-button` with variants.
- **Consistent fields.** Inputs had 0.6rem corners while selects were pills. Fields now share one shape, a 3:1 border, hover
  and focus states, and an error state with a message.
- **Meanings for colour.** Success, info, warning and danger map onto the pastels (sage, sky, butter and a new **rose**), each
  with an AAA ink.
- **Scales.** Type, space, radius, shadow, motion (including a bouncy ease for things that arrive), z-index layers, reading
  widths, breakpoints and chart colours (six categories, a sequential and a diverging scale) are all named tokens.
- **Readable solid stamps.** White numbers on light day colours (yellows, teals) fell below 3:1 in the app. Solid stamps and
  tiles now darken any colour that's too light for white text.
- **Accessibility basics from the GOV.UK Design System.** A skip link, an error summary that takes focus and links to each
  field, arrow-key tabs and menus, and support for Windows Contrast themes.
- **An icon set** in the mark's own line style, replacing the app's text symbols (◍ ⌖ ✎) and one-off SVGs.
- **Missing components.** Tables, an accordion, breadcrumbs, a back link and pagination, notes, toasts, tooltips, progress,
  spinner, skeletons, empty states, switch, radio and checkbox, textarea, tabs, a menu, the bottom sheet as a reusable piece,
  the air-mail edge and a perforated divider.

## Porting it

The classes are plain HTML classes and the tokens are CSS custom properties, so any framework can use them unchanged.
[docs/porting.md](docs/porting.md) shows the same postcard in React, Svelte and Vue, how to point Tailwind at the tokens, and how
to use `tokens.json` where there's no CSS.

| The tour app's name | Postcard |
| --- | --- |
| `--paper`, `--card`, `--glass` | `--pc-paper`, `--pc-card`, `--pc-glass` |
| `--ink` / `--text`, `--muted`, `--line` | `--pc-ink`, `--pc-muted`, `--pc-line` |
| `--accent`, `--accent-ink`, `--accent-soft`, `--on-accent` | `--pc-accent`, `--pc-accent-ink`, `--pc-accent-soft`, `--pc-on-accent` |
| `--sage` … `--lilac` (+ `-ink`) | `--pc-sage` … `--pc-lilac` (+ `-ink`), plus `--pc-rose` |
| `--b-bg`, `--b-card`, `--b-text`, `--b-muted` | `--pc-paper`, `--pc-card`, `--pc-ink`, `--pc-muted` |
| `--b-line`, `--b-line-strong` | `--pc-line`, `--pc-line-strong` |
| `--b-accent` / `--b-link`, `--b-warm`, `--b-warm-text` | `--pc-accent-ink`, `--pc-gold`, `--pc-butter-ink` |
| `--radius`, `--radius-sm`, `--shadow`, `--press` | `--pc-radius`, `--pc-radius-sm`, `--pc-shadow`, `--pc-press` |
| `--font-display`, `--font-ui` | `--pc-font-display`, `--pc-font-ui` |
| `--c` (a day's colour) | `--pc-c` |
| `.theme-night`, `.display`, `.knobs`, `.pills`, `.chip`, `.slider`, `.scroll-y` | `.pc-theme-night`, `.pc-display`, `.pc-knobs`, `.pc-segmented`, `.pc-chip`, `.pc-slider`, `.pc-scroll-y` |

## Writing for it

The voice matches the look: friendly, plain and specific. Name things the way people know them ("Ride from day 1", "Maybe later"),
say what happened ("Subscribed. Check your inbox and click the link to confirm."), and have errors say how to fix the problem
("That postcode is too short. It looks like LL55 4UR."). [docs/content.md](docs/content.md) has the full guide.

## Fonts

Fraunces and Figtree are included under the SIL Open Font License 1.1 (`fonts/OFL-*.txt`), the same files the tour site
self-hosts through Fontsource.
