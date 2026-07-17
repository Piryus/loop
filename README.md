# Loop

**Self-hosted feedback widget.** One `<script>` tag drops a floating button into
any web app. Users capture a screenshot, mark it up, and send a note — it lands in
**Linear** as an issue with the annotated screenshot attached. Open source, no
vendor, no recurring cost.

Think Marker.io / Userback, but you host it and own the data.

- 🎯 **One-line embed** — framework-agnostic, works over React, Next, Vue, static HTML.
- 🖼 **Capture + annotate** — full-page or drag-to-select a region, then box / arrow / pin.
- 🧊 **Fully isolated** — renders in a shadow root with `all: initial`; can't clash with the host page's CSS.
- 🌗 **Theme-aware** — follows `prefers-color-scheme`, or force light/dark.
- 🌍 **Localized** — English, French, German, Spanish, Italian out of the box (auto-detected).
- 🪶 **Lightweight** — ~21 KB gzipped, one self-contained file, zero runtime peers.
- ♿️ **Accessible** — keyboard path, focus rings, `Esc` to cancel, reduced-motion fallbacks.

## Quick start

Drop in the bundle and initialize:

```html
<script src="https://your-host/loop.js"></script>
<script>
  Loop.init({
    endpoint: "https://your-host/api/feedback",
    projectKey: "acme-app",
    user: { name: "Ada Lovelace", email: "ada@acme.com" }, // if you know who it is
  });
</script>
```

Or as a module:

```ts
import { init } from "@loop/widget";
init({ endpoint: "/api/feedback", projectKey: "acme-app" });
```

The widget POSTs a JSON payload (note, type, annotated screenshot, page context)
to your `endpoint`. Wire that endpoint to Linear with the reference backend in
[`server/`](./server/README.md) — it holds your Linear key and creates the issue,
so no secret ever touches the browser.

## Configuration

| Option       | Type                                   | Default            | Description |
|--------------|----------------------------------------|--------------------|-------------|
| `endpoint`   | `string`                               | —                  | Backend URL that creates the Linear issue. |
| `projectKey` | `string`                               | —                  | Tag routed with every submission. |
| `user`       | `{ name?, email?, id? }`               | —                  | Known submitter, shown on the report. |
| `position`   | `"bottom-right" \| "bottom-left"`      | `"bottom-right"`   | Floating button placement. |
| `theme`      | `"light" \| "dark" \| "auto"`          | `"auto"`           | Force a theme or follow the system. |
| `locale`     | `string` (e.g. `"fr"`)                 | `navigator.language` | Force a UI language. |
| `accent`     | CSS color                              | Loop amber         | Override the pop color. |
| `metadata`   | `Record<string, string>`               | —                  | Extra fields merged into every report (app version, route…). |
| `onSubmit`   | `(payload) => void \| Promise<void>`   | —                  | Hook after send; can return a promise the widget awaits. |

Without an `endpoint`, submissions log to the console — handy for wiring up
`onSubmit` to your own sink.

## How it works

```
host page ──<script>──▶ Loop widget (shadow DOM)
                          │  capture (modern-screenshot) → annotate (canvas)
                          ▼
                    POST /api/feedback  ──▶  your endpoint  ──▶  Linear issue
                    (note + PNG + context)   (holds the key)      (+ screenshot)
```

Two audiences, cleanly split: **reporters** click the widget and never log in;
the **team** triages in a dedicated Linear workspace they're invited to.

## Develop

```bash
npm install
npm run dev          # demo host app + widget at http://localhost:5273
                     #   ?theme=light|dark   ?lang=fr|de|es|it
```

## Build

```bash
npm run build:widget   # → dist/loop.js (IIFE global) + dist/loop.mjs (ESM)
```

## Project layout

```
src/loop/       widget source (framework-free TypeScript)
  index.ts        public API — init() / destroy(), shadow-root mount + theming
  widget.ts       controller / state machine + all screens
  capture.ts      screenshot + region crop
  annotate.ts     canvas annotator (box / arrow / pin)
  i18n.ts         string tables (en/fr/de/es/it)
  styles.ts       design tokens + component CSS (OKLCH)
server/         reference Linear backend
PRODUCT.md      who/what/why    DESIGN.md   the visual system
```

## License

MIT © Emile Legendre
