export type Tool = "box" | "arrow" | "pin";

type Shape =
  | { kind: "box"; x: number; y: number; w: number; h: number }
  | { kind: "arrow"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "pin"; x: number; y: number; n: number };

interface AnnotatorOpts {
  color?: string;
  onChange?: () => void;
}

/**
 * Canvas annotator over a captured screenshot. Draws boxes, arrows and pins in
 * source-resolution pixels so the exported PNG is crisp, and outlines every
 * mark in a dark halo so it stays visible over light or dark screenshots.
 */
export class Annotator {
  private source: HTMLCanvasElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private shapes: Shape[] = [];
  private draft: Shape | null = null;
  private tool: Tool = "box";
  private pins = 0;
  private color: string;
  private onChange?: () => void;
  private drawing = false;

  constructor(source: HTMLCanvasElement, opts: AnnotatorOpts = {}) {
    this.source = source;
    this.color = opts.color ?? "#F6A623";
    this.onChange = opts.onChange;
  }

  mount(wrap: HTMLElement) {
    const c = document.createElement("canvas");
    c.width = this.source.width;
    c.height = this.source.height;
    c.style.maxWidth = "100%";
    c.style.maxHeight = "100%";
    c.style.width = `${this.source.width / (Math.min(window.devicePixelRatio || 1, 2))}px`;
    this.canvas = c;
    this.ctx = c.getContext("2d")!;
    wrap.appendChild(c);
    this.redraw();

    c.addEventListener("pointerdown", this.onDown);
    c.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerup", this.onUp);
  }

  setTool(t: Tool) {
    this.tool = t;
  }
  get canUndo() {
    return this.shapes.length > 0;
  }
  undo() {
    const last = this.shapes.pop();
    if (last?.kind === "pin") this.pins = Math.max(0, this.pins - 1);
    this.redraw();
    this.onChange?.();
  }

  private toLocal(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * this.canvas.width,
      y: ((e.clientY - r.top) / r.height) * this.canvas.height,
    };
  }

  private onDown = (e: PointerEvent) => {
    e.preventDefault();
    const p = this.toLocal(e);
    if (this.tool === "pin") {
      this.shapes.push({ kind: "pin", x: p.x, y: p.y, n: ++this.pins });
      this.redraw();
      this.onChange?.();
      return;
    }
    this.drawing = true;
    this.draft =
      this.tool === "box"
        ? { kind: "box", x: p.x, y: p.y, w: 0, h: 0 }
        : { kind: "arrow", x1: p.x, y1: p.y, x2: p.x, y2: p.y };
  };

  private onMove = (e: PointerEvent) => {
    if (!this.drawing || !this.draft) return;
    const p = this.toLocal(e);
    if (this.draft.kind === "box") {
      this.draft.w = p.x - this.draft.x;
      this.draft.h = p.y - this.draft.y;
    } else if (this.draft.kind === "arrow") {
      this.draft.x2 = p.x;
      this.draft.y2 = p.y;
    }
    this.redraw();
  };

  private onUp = () => {
    if (!this.drawing || !this.draft) return;
    this.drawing = false;
    const d = this.draft;
    const big =
      (d.kind === "box" && (Math.abs(d.w) > 6 || Math.abs(d.h) > 6)) ||
      (d.kind === "arrow" && Math.hypot(d.x2 - d.x1, d.y2 - d.y1) > 8);
    if (big) {
      this.shapes.push(d);
      this.onChange?.();
    }
    this.draft = null;
    this.redraw();
  };

  private lw() {
    return Math.max(3, Math.round(this.canvas.width / 260));
  }

  private redraw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.source, 0, 0);
    for (const s of this.shapes) this.paint(s);
    if (this.draft) this.paint(this.draft);
  }

  private paint(s: Shape) {
    const ctx = this.ctx;
    const lw = this.lw();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    if (s.kind === "box") {
      const x = Math.min(s.x, s.x + s.w);
      const y = Math.min(s.y, s.y + s.h);
      const w = Math.abs(s.w);
      const h = Math.abs(s.h);
      const r = Math.min(10, w / 2, h / 2);
      this.halo(() => this.roundRect(x, y, w, h, r), lw);
    } else if (s.kind === "arrow") {
      this.halo(() => this.arrow(s.x1, s.y1, s.x2, s.y2, lw), lw);
    } else {
      this.pin(s.x, s.y, s.n, lw);
    }
  }

  private halo(path: () => void, lw: number) {
    const ctx = this.ctx;
    ctx.strokeStyle = "rgba(0,0,0,0.34)";
    ctx.lineWidth = lw + 3;
    path();
    ctx.stroke();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = lw;
    path();
    ctx.stroke();
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private arrow(x1: number, y1: number, x2: number, y2: number, lw: number) {
    const ctx = this.ctx;
    const a = Math.atan2(y2 - y1, x2 - x1);
    const head = Math.max(14, lw * 4.2);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - Math.PI / 7), y2 - head * Math.sin(a - Math.PI / 7));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a + Math.PI / 7), y2 - head * Math.sin(a + Math.PI / 7));
  }

  private pin(x: number, y: number, n: number, lw: number) {
    const ctx = this.ctx;
    const r = Math.max(15, lw * 5);
    ctx.beginPath();
    ctx.arc(x, y, r + 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.fillStyle = "#2A1C05";
    ctx.font = `700 ${Math.round(r * 1.15)}px ${getComputedStyle(document.body).fontFamily || "sans-serif"}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(n), x, y + 1);
  }

  toDataURL(): string {
    return this.canvas.toDataURL("image/png");
  }

  destroy() {
    window.removeEventListener("pointerup", this.onUp);
  }
}
