# Postcard

The look of the [Parks Tour](https://gt-retrospective.vercel.app/the-parks-26/), set aside as a style guide of its own: warm paper,
soft pastel fills, deep slate ink and one terracotta accent. Things are rounded, they lean a little, and they press down when you
touch them. The brief was **whimsy, playfulness and approachability**, without giving up readability: every text colour reaches
7:1 contrast (WCAG AAA) in every theme.

**See it live: https://jonibach.github.io/postcard-styleguide/**

It's plain CSS (custom properties and `pc-` classes) plus a few optional vanilla JS helpers, with no build step and no
dependencies. A React, Svelte, Vue or native app can use it as it is or port it piece by piece.

```sh
npm run dev     # the living style guide on http://localhost:4321
npm run check   # contrast check for every theme
npm run build   # dist/: one bundled CSS file, the fonts, the helpers and tokens.json
```

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

Link the bundle (after `npm run build`), keeping `dist/fonts/` next to it:

```html
<link rel="stylesheet" href="postcard-styleguide/dist/postcard.css" />
```

Or, during development, link `postcard.css`, which imports each file in `css/`. You can import single files instead:
`css/tokens.css` is the only one the others depend on.

Install from GitHub into another project:

```sh
npm install github:JoniBach/postcard-styleguide
```

```js
import 'postcard-styleguide';                       // dist/postcard.css, through your bundler
import { setTheme, toast, dayColor } from 'postcard-styleguide/js';
```

It relies on modern CSS: custom properties, `color-mix()`, `:has()` and `<dialog>`. That's Safari 16.4+, Chrome/Edge 111+ and
Firefox 121+, all from 2023 or later.

## What's inside

| File | What it holds |
| --- | --- |
| `css/tokens.css` | Every colour, font, size, space, radius, shadow, tilt and timing, as `--pc-*` custom properties, for three themes |
| `css/fonts.css` | Fraunces (SOFT, WONK and optical-size axes) and Figtree, self-hosted from `fonts/` |
| `css/base.css` | The page, type classes (`pc-h1`, `pc-eyebrow`, `pc-lede`, `pc-label`), `pc-prose` for long reading, focus, reduced motion |
| `css/components/button.css` | `pc-button` (primary, ink, soft, ghost; sm, lg, block; disabled, busy) and `pc-icon-button` |
| `css/components/pillbar.css` | `pc-topbar`, frosted `pc-pill`, `pc-brand` with `pc-mark`, `pc-segmented` (views, tabs, toggles), `pc-menu` |
| `css/components/chip.css` | `pc-tag` in each pastel, `pc-chip` toggle filters, `pc-badge`, `pc-dot` |
| `css/components/field.css` | `pc-field` with label, hint and error; `pc-input`, `pc-select`, `pc-textarea`, `pc-check`, `pc-switch`, `pc-slider`, `pc-knobs` |
| `css/components/stamp.css` | `pc-stamp` (tinted, solid, outline; sm, lg; a "land" animation) and `pc-tile` |
| `css/components/card.css` | `pc-card`, `pc-postcard` (art, stamp, body), `pc-banner`, `pc-panel`, `pc-postcards` grid |
| `css/components/rail.css` | `pc-rail`, the journey rail: a thread through stamps, filled to where you are; `pc-rail--across` for phones |
| `css/components/feedback.css` | `pc-note` (info, success, warning, danger, tip), `pc-toast`, `data-tip` tooltips, `pc-progress`, `pc-spinner`, `pc-skeleton`, `pc-empty` |
| `css/components/overlay.css` | `pc-dialog` on the native `<dialog>`, `pc-sheet` (bottom sheet) and `pc-scrim` |
| `css/utilities.css` | `pc-container`, `pc-stack`, `pc-cluster`, `pc-grid`, `pc-sr-only`, `pc-scroll-y/x`, `pc-perforation`, `pc-airmail`, `pc-tilt` |
| `js/postcard.js` | `setTheme` / `restoreTheme` / `currentTheme`, `toast`, `dayColor`, `sheet`. Plain ES module, nothing runs on import |
| `index.html` | The living style guide: every token and component, in every theme |
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
- **Scales.** Type, space, radius, shadow, motion (including a bouncy ease for things that arrive), z-index layers and reading
  widths are all named tokens.
- **Missing components.** Notes, toasts, tooltips, progress, spinner, skeletons, empty states, switch, radio and checkbox,
  textarea, tabs, a menu, the bottom sheet as a reusable piece, the air-mail edge and a perforated divider.

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
("That postcode is too short. It looks like LL55 4UR.").

## Fonts

Fraunces and Figtree are included under the SIL Open Font License 1.1 (`fonts/OFL-*.txt`), the same files the tour site
self-hosts through Fontsource.
