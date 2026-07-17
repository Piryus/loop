# Product

## Register

product

## Users

Two audiences, deliberately split:

- **Reporters** — anyone using a host app where Loop is embedded: staff, clients,
  or anonymous end-users (e.g. people filling an expense form). They never log in.
  They click the floating button, optionally grab and mark up a screenshot, type a
  note, and send. Context is captured for them (URL, browser, viewport).
- **Maintainers** — the person or team who owns the host app and receives the
  feedback. They live in Linear (a dedicated workspace), where each submission
  lands as an issue with the annotated screenshot attached and metadata in the body.

## Product Purpose

Loop is an embeddable, self-hosted feedback widget. One `<script>` tag drops a
floating button into any web app; reporters send annotated screenshots + notes,
which become Linear issues via a small stateless endpoint. It replaces the
email-round-trip of "here's what's broken" with a one-click, visually-anchored
report. Success = a hesitant, non-technical user can report a problem in under
30 seconds, and the maintainer gets everything they need to reproduce it without
a follow-up. Open source, no vendor, no recurring cost.

## Brand Personality

Sharp, confident, quietly delightful. Voice is plain and human ("What's going
on?", "Sent — thank you!"), never corporate. The widget behaves like a precise
tool that gets out of the way, then rewards the send with one bright moment. Three
words: **precise, confident, warm-on-send.**

## Anti-references

- **Corporate / enterprise-gray feedback tooling** (Jira, Zendesk, UserVoice) —
  dull, bureaucratic, form-heavy.
- **Generic SaaS purple-gradient** — the indistinct violet-gradient template look.
- Cutesy mascots / toy bounce. It's a real tool, not a game.
- Decorative glassmorphism as a default surface.

## Design Principles

1. **The tool disappears until needed.** One unobtrusive button; full-screen only
   during capture/annotate; never competes with the host app's own UI.
2. **Earned familiarity over novelty.** Standard affordances (textarea, chips,
   crosshair select, drag-to-draw) so anyone can use it without instruction.
3. **One pop, everywhere else calm.** A single amber carries the button, the
   active state, and the success moment. The rest is confident near-neutral.
4. **Isolation is non-negotiable.** Shadow DOM + `all: initial`; the widget can
   neither style nor be styled by whatever host it lands in.
5. **Every state designed.** capturing, uploading, success, error, disabled,
   empty — none left to the browser default.

## Accessibility & Inclusion

- Target WCAG AA: body/label text ≥ 4.5:1 in both themes; amber buttons use dark
  ink for contrast.
- Full keyboard path: focusable controls, visible `:focus-visible` amber ring,
  `Esc` cancels capture/annotate, `aria-pressed` on toggles, `role="dialog"`/
  `role="toolbar"` landmarks.
- Theme-aware (follows `prefers-color-scheme`) since it overlays arbitrary hosts.
- `prefers-reduced-motion` alternative for every animation (crossfade / instant).
