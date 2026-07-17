// All Loop styles live here as a single string injected into the widget's
// shadow root. Because it's a shadow root, none of this leaks to (or is
// affected by) the host page. Tokens are OKLCH; the amber primary is the
// only saturated color — everything else is a confident near-neutral.

export const styles = /* css */ `
:host {
  /* Amber — the one pop color. */
  --loop-primary: oklch(0.80 0.165 74);
  --loop-primary-strong: oklch(0.735 0.17 68);
  --loop-primary-soft: oklch(0.80 0.165 74 / 0.16);
  --loop-on-primary: oklch(0.24 0.045 68);

  --loop-danger: oklch(0.63 0.205 26);
  --loop-danger-soft: oklch(0.63 0.205 26 / 0.14);

  /* Dark chrome (default). */
  --loop-bg: oklch(0.175 0.007 74);
  --loop-surface: oklch(0.215 0.008 74);
  --loop-surface-2: oklch(0.255 0.009 74);
  --loop-border: oklch(0.31 0.009 74);
  --loop-border-strong: oklch(0.40 0.011 74);
  --loop-ink: oklch(0.965 0.004 74);
  --loop-muted: oklch(0.74 0.007 74);
  --loop-faint: oklch(0.58 0.007 74);
  --loop-scrim: oklch(0.12 0.01 74 / 0.62);

  --loop-radius: 16px;
  --loop-radius-sm: 11px;
  --loop-radius-pill: 999px;
  --loop-shadow: 0 18px 48px -16px oklch(0 0 0 / 0.62), 0 6px 16px -8px oklch(0 0 0 / 0.5);
  --loop-glow: 0 8px 26px -6px oklch(0.80 0.165 74 / 0.6);
  --loop-ring: 0 0 0 3px oklch(0.80 0.165 74 / 0.42);

  --loop-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --loop-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  all: initial;
  font-family: var(--loop-font);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

:host([data-theme="light"]) {
  --loop-bg: oklch(1 0 0);
  --loop-surface: oklch(0.984 0.003 74);
  --loop-surface-2: oklch(0.964 0.004 74);
  --loop-border: oklch(0.912 0.005 74);
  --loop-border-strong: oklch(0.85 0.007 74);
  --loop-ink: oklch(0.23 0.012 74);
  --loop-muted: oklch(0.46 0.012 74);
  --loop-faint: oklch(0.62 0.01 74);
  --loop-scrim: oklch(0.22 0.02 74 / 0.4);
  --loop-shadow: 0 18px 44px -18px oklch(0.2 0.02 74 / 0.28), 0 4px 12px -6px oklch(0.2 0.02 74 / 0.16);
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; }

/* ---------- Root positioning ---------- */
.loop-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2147483000;
  color: var(--loop-ink);
  font-size: 14px;
  line-height: 1.5;
}
.loop-root > * { pointer-events: auto; }

.loop-anchor {
  position: fixed;
  bottom: 22px;
  inset-inline-end: 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}
.loop-root[data-pos="bottom-left"] .loop-anchor {
  inset-inline-end: auto;
  inset-inline-start: 22px;
  align-items: flex-start;
}

/* ---------- Floating button ---------- */
.loop-fab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0;
  height: 52px;
  padding: 0;
  width: 52px;
  justify-content: center;
  border: none;
  border-radius: var(--loop-radius-pill);
  background: var(--loop-primary);
  color: var(--loop-on-primary);
  box-shadow: var(--loop-glow);
  cursor: pointer;
  transition: transform 0.24s var(--loop-ease), box-shadow 0.24s var(--loop-ease), background 0.18s;
  -webkit-tap-highlight-color: transparent;
}
.loop-fab:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 34px -6px oklch(0.80 0.165 74 / 0.72); background: var(--loop-primary); }
.loop-fab:active { transform: translateY(0) scale(0.97); }
.loop-fab:focus-visible { outline: none; box-shadow: var(--loop-glow), var(--loop-ring); }
.loop-fab svg { width: 24px; height: 24px; display: block; transition: transform 0.3s var(--loop-ease); }
.loop-fab .loop-fab__label {
  max-width: 0; overflow: hidden; white-space: nowrap;
  font-weight: 650; font-size: 14px; letter-spacing: -0.005em;
  opacity: 0; transition: max-width 0.28s var(--loop-ease), opacity 0.2s, margin 0.28s var(--loop-ease);
}
.loop-fab:hover .loop-fab__label { max-width: 120px; opacity: 1; margin-inline-start: 9px; margin-inline-end: 4px; }
.loop-fab:hover { width: auto; padding: 0 18px 0 15px; }
.loop-fab.is-open svg { transform: rotate(90deg); }

/* ---------- Panel (composer / states) ---------- */
.loop-panel {
  width: 372px;
  max-width: calc(100vw - 32px);
  background: var(--loop-bg);
  border: 1px solid var(--loop-border);
  border-radius: var(--loop-radius);
  box-shadow: var(--loop-shadow);
  overflow: hidden;
  transform-origin: bottom right;
  animation: loop-pop 0.26s var(--loop-ease) both;
}
.loop-root[data-pos="bottom-left"] .loop-panel { transform-origin: bottom left; }
@keyframes loop-pop {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.loop-head {
  display: flex; align-items: center; gap: 10px;
  padding: 15px 16px 13px;
  border-bottom: 1px solid var(--loop-border);
}
.loop-head__mark { width: 20px; height: 20px; color: var(--loop-primary); flex: none; }
.loop-head__title { font-weight: 650; font-size: 14.5px; letter-spacing: -0.01em; flex: 1; }
.loop-iconbtn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border: none; border-radius: 8px;
  background: transparent; color: var(--loop-muted); cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.loop-iconbtn:hover { background: var(--loop-surface-2); color: var(--loop-ink); }
.loop-iconbtn:focus-visible { outline: none; box-shadow: var(--loop-ring); }
.loop-iconbtn svg { width: 16px; height: 16px; }

.loop-body { padding: 16px; display: flex; flex-direction: column; gap: 15px; }

/* Capture zone */
.loop-capture__label {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 12px; font-weight: 600; color: var(--loop-muted);
  margin-bottom: 9px; letter-spacing: 0.01em;
}
.loop-choices { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.loop-choice {
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
  padding: 13px 13px 12px; border-radius: var(--loop-radius-sm);
  border: 1px solid var(--loop-border); background: var(--loop-surface);
  color: var(--loop-ink); cursor: pointer; text-align: left;
  transition: border-color 0.16s, background 0.16s, transform 0.16s var(--loop-ease);
}
.loop-choice:hover { border-color: var(--loop-primary); background: var(--loop-surface-2); transform: translateY(-1px); }
.loop-choice:focus-visible { outline: none; box-shadow: var(--loop-ring); border-color: var(--loop-primary); }
.loop-choice__ico {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 9px;
  background: var(--loop-primary-soft); color: var(--loop-primary);
}
.loop-choice__ico svg { width: 17px; height: 17px; }
.loop-choice__t { font-weight: 600; font-size: 13px; }
.loop-choice__d { font-size: 11.5px; color: var(--loop-faint); line-height: 1.35; }

/* Screenshot preview (after capture) */
.loop-preview {
  position: relative; border-radius: var(--loop-radius-sm);
  overflow: hidden; border: 1px solid var(--loop-border);
  background: var(--loop-surface);
}
.loop-preview img { display: block; width: 100%; max-height: 168px; object-fit: cover; object-position: top; }
.loop-preview__bar {
  position: absolute; inset-inline: 0; bottom: 0;
  display: flex; gap: 6px; padding: 8px;
  background: linear-gradient(to top, oklch(0.12 0.01 74 / 0.72), transparent);
}
.loop-preview__btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 8px; border: none;
  background: oklch(1 0 0 / 0.14); color: oklch(0.99 0 0);
  backdrop-filter: blur(6px); font-size: 12px; font-weight: 600; cursor: pointer;
  transition: background 0.15s;
}
.loop-preview__btn:hover { background: oklch(1 0 0 / 0.26); }
.loop-preview__btn svg { width: 13px; height: 13px; }
.loop-preview__btn.is-primary { background: var(--loop-primary); color: var(--loop-on-primary); }
.loop-preview__btn.is-primary:hover { background: var(--loop-primary-strong); }

/* Fields */
.loop-textarea {
  width: 100%; min-height: 92px; resize: vertical;
  padding: 12px 13px; border-radius: var(--loop-radius-sm);
  border: 1px solid var(--loop-border); background: var(--loop-surface);
  color: var(--loop-ink); font-size: 14px; line-height: 1.5; font-family: inherit;
  transition: border-color 0.16s, box-shadow 0.16s;
}
.loop-textarea::placeholder { color: var(--loop-faint); }
.loop-textarea:focus { outline: none; border-color: var(--loop-primary); box-shadow: var(--loop-ring); }

.loop-types { display: flex; flex-wrap: wrap; gap: 7px; }
.loop-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: var(--loop-radius-pill);
  border: 1px solid var(--loop-border); background: transparent;
  color: var(--loop-muted); font-size: 12.5px; font-weight: 600; cursor: pointer;
  transition: all 0.15s var(--loop-ease);
}
.loop-chip:hover { color: var(--loop-ink); border-color: var(--loop-border-strong); }
.loop-chip:focus-visible { outline: none; box-shadow: var(--loop-ring); }
.loop-chip[aria-pressed="true"] {
  background: var(--loop-primary); border-color: var(--loop-primary);
  color: var(--loop-on-primary);
}
.loop-chip__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: 0.85; }

/* Footer */
.loop-foot { padding: 13px 16px; border-top: 1px solid var(--loop-border); display: flex; align-items: center; gap: 12px; }
.loop-meta { flex: 1; min-width: 0; font-size: 11.5px; color: var(--loop-faint); line-height: 1.35; }
.loop-meta b { color: var(--loop-muted); font-weight: 600; }
.loop-meta .loop-meta__row { display: flex; align-items: center; gap: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.loop-submit {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 16px; border: none; border-radius: var(--loop-radius-sm);
  background: var(--loop-primary); color: var(--loop-on-primary);
  font-size: 13.5px; font-weight: 700; letter-spacing: -0.005em; cursor: pointer;
  transition: background 0.16s, transform 0.16s var(--loop-ease), box-shadow 0.16s;
  box-shadow: 0 1px 0 oklch(1 0 0 / 0.1) inset;
}
.loop-submit:hover:not(:disabled) { background: var(--loop-primary-strong); transform: translateY(-1px); box-shadow: var(--loop-glow); }
.loop-submit:active:not(:disabled) { transform: translateY(0) scale(0.98); }
.loop-submit:focus-visible { outline: none; box-shadow: var(--loop-ring); }
.loop-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.loop-submit svg { width: 15px; height: 15px; }

/* ---------- Fullscreen capture / annotate ---------- */
.loop-overlay {
  position: fixed; inset: 0; z-index: 2147483400;
  display: flex; flex-direction: column;
  animation: loop-fade 0.18s ease-out both;
}
@keyframes loop-fade { from { opacity: 0; } to { opacity: 1; } }

.loop-select { position: fixed; inset: 0; cursor: crosshair; }
.loop-select__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top left; }
.loop-select__veil { position: absolute; inset: 0; background: var(--loop-scrim); }
.loop-select__rect {
  position: absolute; border: 2px solid var(--loop-primary);
  box-shadow: 0 0 0 100vmax var(--loop-scrim);
  background: transparent; pointer-events: none;
}
.loop-hint {
  position: fixed; inset-block-start: 20px; inset-inline: 0; margin: 0 auto;
  width: max-content; max-width: calc(100vw - 32px);
  display: flex; align-items: center; gap: 9px;
  padding: 9px 15px; border-radius: var(--loop-radius-pill);
  background: var(--loop-bg); border: 1px solid var(--loop-border);
  box-shadow: var(--loop-shadow); font-size: 13px; font-weight: 550; color: var(--loop-ink);
  z-index: 10;
}
.loop-hint kbd {
  font-family: inherit; font-size: 11px; font-weight: 700;
  padding: 2px 7px; border-radius: 6px; background: var(--loop-surface-2);
  border: 1px solid var(--loop-border); color: var(--loop-muted);
}
.loop-hint__mark { width: 15px; height: 15px; color: var(--loop-primary); }

/* Annotate */
.loop-annot { position: fixed; inset: 0; display: flex; flex-direction: column; background: var(--loop-scrim); }
.loop-annot__stage {
  flex: 1; min-height: 0; display: grid; place-items: center; padding: 78px 24px 24px; position: relative; z-index: 1;
}
.loop-annot__canvaswrap {
  position: relative; max-width: 100%; max-height: 100%;
  border-radius: 12px; overflow: hidden; box-shadow: var(--loop-shadow);
  line-height: 0;
}
.loop-annot__canvaswrap canvas { display: block; max-width: 100%; max-height: 100%; cursor: crosshair; touch-action: none; }

.loop-toolbar {
  position: fixed; inset-block-start: 18px; inset-inline: 0; margin: 0 auto;
  width: max-content; max-width: calc(100vw - 24px);
  display: flex; align-items: center; gap: 5px; padding: 7px;
  border-radius: 14px; background: var(--loop-bg);
  border: 1px solid var(--loop-border); box-shadow: var(--loop-shadow);
  z-index: 10;
}
.loop-tool {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  height: 36px; min-width: 36px; padding: 0 9px; border: none; border-radius: 9px;
  background: transparent; color: var(--loop-muted); cursor: pointer; font-size: 13px; font-weight: 600;
  transition: background 0.15s, color 0.15s;
}
.loop-tool:hover { background: var(--loop-surface-2); color: var(--loop-ink); }
.loop-tool:focus-visible { outline: none; box-shadow: var(--loop-ring); }
.loop-tool[aria-pressed="true"] { background: var(--loop-primary-soft); color: var(--loop-primary); }
.loop-tool svg { width: 17px; height: 17px; }
.loop-tool.is-cta { background: var(--loop-primary); color: var(--loop-on-primary); padding: 0 15px; }
.loop-tool.is-cta:hover { background: var(--loop-primary-strong); }
.loop-toolbar__sep { width: 1px; height: 22px; background: var(--loop-border); margin: 0 3px; }

/* ---------- State screens (sending / success / error) ---------- */
.loop-state { padding: 34px 26px 30px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.loop-state__icon { width: 60px; height: 60px; display: grid; place-items: center; margin-bottom: 10px; position: relative; }
.loop-state__title { font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
.loop-state__sub { font-size: 13px; color: var(--loop-muted); max-width: 260px; }
.loop-state__actions { margin-top: 14px; display: flex; gap: 8px; }

.loop-spinner {
  width: 40px; height: 40px; border-radius: 50%;
  border: 3px solid var(--loop-surface-2); border-top-color: var(--loop-primary);
  animation: loop-spin 0.7s linear infinite;
}
@keyframes loop-spin { to { transform: rotate(360deg); } }

.loop-burst { width: 60px; height: 60px; border-radius: 50%; background: var(--loop-primary); color: var(--loop-on-primary); display: grid; place-items: center; animation: loop-burst 0.5s var(--loop-ease) both; }
.loop-burst svg { width: 30px; height: 30px; }
@keyframes loop-burst { 0% { transform: scale(0.3); opacity: 0; } 55% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
.loop-ray { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--loop-primary); animation: loop-ray 0.6s var(--loop-ease) both; }
@keyframes loop-ray { from { transform: scale(0.6); opacity: 0.7; } to { transform: scale(1.8); opacity: 0; } }

.loop-error-icon { width: 60px; height: 60px; border-radius: 50%; background: var(--loop-danger-soft); color: var(--loop-danger); display: grid; place-items: center; }
.loop-error-icon svg { width: 28px; height: 28px; }

.loop-ghostbtn {
  padding: 9px 15px; border-radius: var(--loop-radius-sm);
  border: 1px solid var(--loop-border); background: transparent; color: var(--loop-ink);
  font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s, border-color 0.15s;
}
.loop-ghostbtn:hover { background: var(--loop-surface); border-color: var(--loop-border-strong); }
.loop-ghostbtn:focus-visible { outline: none; box-shadow: var(--loop-ring); }

.loop-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .loop-panel, .loop-overlay, .loop-burst, .loop-ray, .loop-fab, .loop-choice, .loop-submit { animation: none !important; transition: none !important; }
  .loop-spinner { animation-duration: 1.4s; }
}
`;
