# Changelog

Postcard follows [semantic versioning](https://semver.org/): a change to a class name, a token name or a helper's signature is
a major version, new components are minor versions, and fixes are patches. Before 1.0, minor versions may still rename things,
and every rename is listed here.

## 0.3.1 (2026-10-06)

**Fixed**
- The six icons added in 0.3.0 (`scissors`, `book`, `link`, `sparkle`, `reset`, `arrow-up`) had landed inside the sprite's
  comment, so they drew nothing. They're real symbols now, and a new test parses the sprite and checks every icon draws.
- The style guide lists icons by parsing the sprite, not by searching its text.

**Added**
- `@jonibach/postcard/postcard.min.css`, an import path ending in `.css` that TypeScript accepts. The README and porting
  guide use it.

## 0.3.0 (2026-10-06)

What moving the Parks Tour app onto Postcard needed.

**Added**
- `pc-pills`: a wrapping group of toggle pills for settings with several short options (the chosen one in ink; hologram
  colours in night).
- `pc-icon-button--glass`, a frosted round button for floating over a map or scene, and a pressed state for icon buttons
  (`aria-pressed="true"`).
- Icons: `scissors`, `book`, `link`, `sparkle`, `reset` and `arrow-up` (48 in all).

## 0.2.1 (2026-10-06)

**Changed**
- Published to npm as `@jonibach/postcard`, which also puts it on the jsDelivr and unpkg CDNs. Install with
  `npm install @jonibach/postcard`; the GitHub install still works but is no longer the recommended way.
- The package ships built: `dist/` is made just before publishing, not on install, so installs don't need the test tools.
- New export `@jonibach/postcard/min.css`. CSS files are marked as side effects, so bundlers keep the imports.
- Releases publish from GitHub Actions with provenance, through npm trusted publishing.

## 0.2.0 (2026-10-06)

Filling the gaps compared with Bootstrap and the GOV.UK Design System.

**Added**
- Icons: 42 line icons in `icons/icons.svg`, drawn like the mark, with `pc-icon` and `pc-icon-disc`. `npm run build` also writes
  each icon to `dist/icons/`.
- Skip link: `pc-skip-link`.
- Error summary: `pc-error-summary`, with the `errorSummary()` helper to focus it and move into each field.
- Tables: `pc-table` and `pc-table-wrap`.
- Show and hide: `pc-details` and `pc-accordion` on native `<details>`, with an `accordion()` helper for "Show all".
- Wayfinding: `pc-breadcrumbs`, `pc-back-link`, `pc-pagination` and `pc-pages`.
- Keyboard behaviour: `tabs()` (roving focus, arrow keys, panels) and `menuButton()` (arrow keys, Esc, click outside).
- Windows Contrast themes: `css/forced-colors.css`.

- Summaries: `pc-summary` (card and inline) and the `pc-confirmation` panel.
- Form inputs: `pc-fieldset` with legend and hint, `pc-choices` with per-option hints, character count (`pc-count` and
  `charCount()`), file upload (`pc-file`, `pc-dropzone`) and a three-box date (`pc-date`).
- Photos: `pc-figure`, `pc-figure--snapshot`, `pc-gallery` and a `lightbox()` viewer.
- Site footer: `pc-footer`.
- Tokens: breakpoints (`--pc-bp-*`) and chart colours (`--pc-chart-1`–`6`, `--pc-seq-1`–`5`, `--pc-div-1`–`5`), all checked
  for 3:1 on paper; a `token()` helper reads them for chart libraries.
- Print styles: `css/print.css`.
- Guidance and copyable code for every section of the style guide, taken from the live examples.
- A content guide: `docs/content.md`.
- Tests: behaviour and axe accessibility tests (WCAG 2.2 AA, Paper and Dusk, with the dialog and lightbox open), and
  screenshot tests of every section; CI runs the check, the build and the tests.

**Changed**
- Solid stamps and tiles darken any colour too light for their white number (relative colour, `oklch(from …)`), so they
  reach 4.5:1 on every day colour.
- The bottom sheet is `display: none` when hidden and slides up when shown.
- The style guide page numbers its sections automatically and gains Icons, Tables, Show and hide, Summaries, Photos, Charts
  and Accessibility sections.

## 0.1.0 (2026-10-06)

First version, taken from the Parks Tour site: tokens for Paper, Dusk and Night; the fonts; buttons, pill bar, chips and tags,
fields, stamps, postcards and banners, the journey rail, notes, toasts, tooltips, progress, dialog and sheet; the theme, toast,
dayColor and sheet helpers; the contrast check and the build.
