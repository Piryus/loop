import { domToCanvas } from "modern-screenshot";

export interface Shot {
  /** Cropped to the visible viewport, at `scale` device pixels per CSS px. */
  canvas: HTMLCanvasElement;
  scale: number;
  cssWidth: number;
  cssHeight: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Renders the current page to a canvas cropped to what the user sees (the
 * viewport), excluding the widget's own DOM. Coordinates map 1:1 to CSS
 * pixels once divided by `scale`, which keeps region selection accurate.
 */
export async function captureViewport(exclude: Element): Promise<Shot> {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const bg = readBg();

  const full = await domToCanvas(document.body, {
    scale,
    backgroundColor: bg,
    filter: (node) =>
      !(node instanceof Element && (node === exclude || exclude.contains(node) || node.hasAttribute?.("data-loop-ignore"))),
  });

  const cssWidth = document.documentElement.clientWidth;
  const cssHeight = window.innerHeight;
  const out = document.createElement("canvas");
  out.width = Math.round(cssWidth * scale);
  out.height = Math.round(cssHeight * scale);
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(
    full,
    Math.round(window.scrollX * scale),
    Math.round(window.scrollY * scale),
    out.width,
    out.height,
    0,
    0,
    out.width,
    out.height
  );

  return { canvas: out, scale, cssWidth, cssHeight };
}

/** Crop a shot to a CSS-pixel rect (from region selection). */
export function cropShot(shot: Shot, rectCss: Rect): Shot {
  const s = shot.scale;
  const w = Math.max(1, Math.round(rectCss.w * s));
  const h = Math.max(1, Math.round(rectCss.h * s));
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  out.getContext("2d")!.drawImage(
    shot.canvas,
    Math.round(rectCss.x * s),
    Math.round(rectCss.y * s),
    w,
    h,
    0,
    0,
    w,
    h
  );
  return { canvas: out, scale: s, cssWidth: rectCss.w, cssHeight: rectCss.h };
}

function readBg(): string {
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  if (bodyBg && bodyBg !== "rgba(0, 0, 0, 0)" && bodyBg !== "transparent") return bodyBg;
  const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
  if (htmlBg && htmlBg !== "rgba(0, 0, 0, 0)" && htmlBg !== "transparent") return htmlBg;
  return "#ffffff";
}
