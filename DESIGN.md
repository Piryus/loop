# Design

Visual system for the Loop feedback widget. All values are shipped as CSS custom
properties inside the widget's shadow root (`src/loop/styles.ts`), isolated from
any host page via `all: initial` on `:host`.

## Theme

Theme-aware: follows `prefers-color-scheme` (overridable via `config.theme`). The
widget carries its own identity in both modes — a confident near-neutral chrome
with a single amber pop — rather than mimicking the host page. Dark is the base;
light is an override on `:host([data-theme="light"])`.

Color strategy: **Committed** — one saturated amber carries the button, active
states, focus rings, primary actions, and the success moment. Everything else is
a near-neutral so the pop always reads.

## Color palette (OKLCH)

**Brand**
- `--loop-primary` `oklch(0.80 0.165 74)` — amber, the one pop color
- `--loop-primary-strong` `oklch(0.735 0.17 68)` — hover/active
- `--loop-on-primary` `oklch(0.24 0.045 68)` — dark ink on amber (AA contrast)
- `--loop-danger` `oklch(0.63 0.205 26)` — errors only

**Dark chrome (default)**
- bg `oklch(0.175 0.007 74)` · surface `oklch(0.215 0.008 74)` · surface-2 `oklch(0.255 0.009 74)`
- border `oklch(0.31 0.009 74)` · ink `oklch(0.965 0.004 74)` · muted `oklch(0.74 0.007 74)` · faint `oklch(0.58 0.007 74)`

**Light chrome**
- bg `oklch(1 0 0)` (pure white) · surface `oklch(0.984 0.003 74)` · border `oklch(0.912 0.005 74)`
- ink `oklch(0.23 0.012 74)` · muted `oklch(0.46 0.012 74)` · faint `oklch(0.62 0.01 74)`

Neutrals carry a whisper of the brand hue (74°) at very low chroma so the chrome
feels part of the amber family without tinting toward "warm-by-default".

## Typography

One family — the host/system sans stack (`ui-sans-serif, system-ui, …`); no
display face (product register). Fixed rem-ish px scale: title 14.5px/650,
body 14px, labels 12–13px/600, meta 11.5px. Letter-spacing -0.005 to -0.01em on
headings only.

## Components & states

- **Floating button** — 52px amber pill, dark glyph, amber glow. States: default,
  hover (lift + widen to reveal label), active (press), focus-visible (amber ring),
  open (glyph rotates). Positions bottom-right (default) / bottom-left.
- **Composer panel** — 372px, radius 16px, elevation shadow; header, capture zone,
  textarea, type chips, footer with metadata + submit. `loop-pop` entrance.
- **Capture choices** — two cards (Full page / Select area), amber-soft icon tiles.
- **Preview** — screenshot thumbnail with a blurred action bar (Annotate / Retake / Remove).
- **Type chips** — pill toggles; selected = filled amber + dark ink, `aria-pressed`.
- **Region select** — full-screen frozen capture, scrim, amber crosshair rect, hint pill.
- **Annotate toolbar** — Box / Arrow / Pin / Undo / Cancel / Done; amber active tool
  and amber CTA. Marks drawn amber with a dark halo for visibility over any shot.
- **State screens** — sending (amber spinner), success (amber burst + ray + check),
  error (danger icon + Back / Try again). Every interactive control has default,
  hover, focus, active, disabled.

## Motion

150–260ms, ease-out (`cubic-bezier(0.22,1,0.36,1)`). Panel pop, button lift, tool
transitions, success burst/ray. Full `prefers-reduced-motion` fallback (animations
disabled, spinner slowed). Motion conveys state only — no decorative choreography.

## Radii & elevation

Radius: 16px panel, 11px inputs/buttons, 999px pills. One elevation shadow on
floating surfaces (never paired 1px-border + wide-shadow "ghost card"). Semantic
z-index scale within the shadow root; root container at `2147483000` to sit above
host UI.
