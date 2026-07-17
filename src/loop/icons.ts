// Inline SVGs (currentColor). 24×24, 2px stroke, round joins — one consistent
// icon family across the whole widget, per the product register.

const svg = (inner: string, w = 24) =>
  `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const icons = {
  // Loop mark: a feedback loop — arced arrow returning on itself.
  mark: svg(
    `<path d="M20 11.5a8 8 0 1 0-2.3 5.6"/><path d="M20 6v5h-5"/><circle cx="12" cy="11.5" r="2.4" fill="currentColor" stroke="none"/>`
  ),
  close: svg(`<path d="M6 6l12 12M18 6L6 18"/>`),
  camera: svg(
    `<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1L9 4h6l1.5 2h1A2.5 2.5 0 0 1 20 8.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.2"/>`
  ),
  crop: svg(
    `<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M2 6h14a2 2 0 0 1 2 2v14"/>`
  ),
  edit: svg(
    `<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>`
  ),
  retake: svg(`<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>`),
  trash: svg(
    `<path d="M4 7h16"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>`
  ),
  send: svg(`<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>`),
  box: svg(`<rect x="4" y="5" width="16" height="14" rx="1.5"/>`),
  arrow: svg(`<path d="M5 19 19 5"/><path d="M11 5h8v8"/>`),
  pin: svg(
    `<path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>`
  ),
  undo: svg(`<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>`),
  check: svg(`<path d="M20 6 9 17l-5-5"/>`),
  alert: svg(
    `<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"/>`
  ),
};

export type IconName = keyof typeof icons;
