# Working on the site

`README.md` is the public document. Edit it to change the page, rule index, metadata, and raw Markdown download. The build treats Markdown as trusted repository content: review changes before publishing.

## Local preview

Use Node.js 22 or newer.

```sh
npm ci
npm test
npm run build
npm run preview
```

Re-run the build after changes. Presentation lives in `src/`; `dist/` is generated and never committed. No framework, application server, or external font service is required.

The preview server bundles styles, navigation, the font, and favicon into a compressed HTML response to avoid extra round trips through a remote orb portal. It reads the latest build on each request and disables caching. This transformation is preview-only: it never modifies `dist/`, and production hosting still serves the separate built assets. `/yoren.md` remains available as raw Markdown.

The preview sends `X-Amp-Review-Widget: off` to avoid optional portal-injected review requests. This disables the floating page-comment button in Amp portals; give feedback in the thread instead. Remove this header to restore the widget. Production hosting is unaffected.

## Static hosting

Connect the GitHub repository to a static site host such as Sevalla:

- Install: `npm ci` (include development dependencies).
- Build: `npm run build`.
- Publish directory: `dist`.
- Production branch: `main`.
- Node.js: 22 or newer.

Only `dist/` is public output. Do not publish the repository root. The build explicitly includes the rendered document, its raw Markdown, styles, navigation script, favicon, and licensed self-hosted font.

Connect `yoren.md` only after reviewing a preview deployment. Deployment and DNS configuration are separate from preparing the code. Once automatic deployments are enabled, pushing to the configured production branch will publish changes.

## Checks

`npm test` checks content-derived navigation, duplicate heading anchors, metadata, raw Markdown fidelity, and the output allowlist. Browser checks should cover desktop lookup, mobile menu selection and Escape, direct fragment URLs, back/forward navigation, keyboard focus, narrow screens, and reading without JavaScript.

The full document is also available in print layout. The Source Serif 4 font is distributed under the SIL Open Font License; the build includes its license in `dist/fonts/`.
