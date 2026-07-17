import { el } from "./dom";
import { icons } from "./icons";
import { captureViewport, cropShot, type Rect, type Shot } from "./capture";
import { Annotator, type Tool } from "./annotate";
import { buildContext, browserLabel } from "./env";
import { ship } from "./submit";
import { resolveStrings, type Strings } from "./i18n";
import type { FeedbackPayload, FeedbackType, LoopConfig, Screen } from "./types";

const TYPE_IDS: FeedbackType[] = ["bug", "idea", "question", "praise"];

export class LoopWidget {
  private root: HTMLElement;
  private hostEl: Element;
  private config: LoopConfig;
  private t: Strings;

  private anchor!: HTMLElement;
  private fab!: HTMLButtonElement;
  private panel: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;
  private annotator: Annotator | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  private screen: Screen = "closed";
  private type: FeedbackType = "bug";
  private message = "";
  private shot: Shot | null = null;
  private annotated: string | null = null;
  private errorMsg = "";

  constructor(root: HTMLElement, hostEl: Element, config: LoopConfig) {
    this.root = root;
    this.hostEl = hostEl;
    this.config = config;
    this.t = resolveStrings(config.locale);
    if (config.accent) root.style.setProperty("--loop-primary", config.accent);
    this.build();
  }

  private build() {
    this.fab = el("button", {
      class: "loop-fab",
      type: "button",
      "aria-label": this.t.title,
      "aria-haspopup": "dialog",
      onClick: () => (this.screen === "closed" ? this.open() : this.close()),
      html: `${icons.mark}<span class="loop-fab__label">${this.t.fabLabel}</span>`,
    });
    this.anchor = el("div", { class: "loop-anchor" }, this.fab);
    this.root.appendChild(this.anchor);
  }

  // ---- screen management ---------------------------------------------------
  private set(screen: Screen) {
    this.screen = screen;
    this.clearOverlay();
    this.removePanel();

    if (screen === "closed") {
      this.fab.classList.remove("is-open");
      this.fab.setAttribute("aria-label", this.t.title);
      this.anchor.style.display = "";
      return;
    }
    this.fab.classList.add("is-open");
    this.fab.setAttribute("aria-label", this.t.close);

    if (screen === "selecting") {
      this.anchor.style.display = "none";
      this.renderSelect();
    } else if (screen === "annotating") {
      this.anchor.style.display = "none";
      this.renderAnnotate();
    } else {
      this.anchor.style.display = "";
      this.renderPanel();
    }
  }

  private open() {
    this.set("compose");
    this.panel?.querySelector<HTMLTextAreaElement>(".loop-textarea")?.focus();
  }
  private close() {
    this.set("closed");
  }
  private reset() {
    this.message = "";
    this.shot = null;
    this.annotated = null;
    this.type = "bug";
    this.errorMsg = "";
  }

  private removePanel() {
    this.panel?.remove();
    this.panel = null;
  }
  private clearOverlay() {
    this.annotator?.destroy();
    this.annotator = null;
    this.overlay?.remove();
    this.overlay = null;
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
  }

  private mountPanel(node: HTMLElement) {
    this.panel = node;
    this.anchor.insertBefore(node, this.fab);
  }

  // ---- compose + state panels ---------------------------------------------
  private renderPanel() {
    if (this.screen === "sending") return this.mountPanel(this.statePanel("sending"));
    if (this.screen === "success") return this.mountPanel(this.statePanel("success"));
    if (this.screen === "error") return this.mountPanel(this.statePanel("error"));
    return this.mountPanel(this.composePanel());
  }

  private head() {
    return el(
      "div",
      { class: "loop-head" },
      el("span", { class: "loop-head__mark", html: icons.mark }),
      el("span", { class: "loop-head__title" }, this.t.title),
      el("button", {
        class: "loop-iconbtn",
        type: "button",
        "aria-label": this.t.close,
        onClick: () => this.close(),
        html: icons.close,
      })
    );
  }

  private composePanel(): HTMLElement {
    const body = el("div", { class: "loop-body" });

    // capture section
    const capLabel = el(
      "div",
      { class: "loop-capture__label" },
      el("span", {}, this.t.screenshot),
      el("span", { style: { color: "var(--loop-faint)", fontWeight: "500" } }, this.t.optional)
    );
    const capSlot = el("div", {}, this.shot ? this.preview() : this.choices());
    body.append(el("div", {}, capLabel, capSlot));

    if (this.errorMsg && this.screen === "compose") {
      body.append(
        el("div", { style: { fontSize: "12px", color: "var(--loop-danger)", marginTop: "-4px" } }, this.errorMsg)
      );
    }

    // message
    const ta = el("textarea", {
      class: "loop-textarea",
      placeholder: this.t.placeholder,
      value: this.message,
      "aria-label": this.t.feedbackAria,
      onInput: (e: Event) => {
        this.message = (e.target as HTMLTextAreaElement).value;
        submit.disabled = !this.canSubmit();
      },
    });
    body.append(ta);

    // type chips
    const chips = el(
      "div",
      { class: "loop-types", role: "group", "aria-label": this.t.typeGroupAria },
      ...TYPE_IDS.map((id) =>
        el(
          "button",
          {
            class: "loop-chip",
            type: "button",
            "aria-pressed": String(this.type === id),
            onClick: (e: Event) => {
              this.type = id;
              this.panel
                ?.querySelectorAll(".loop-chip")
                .forEach((c) => c.setAttribute("aria-pressed", "false"));
              (e.currentTarget as HTMLElement).setAttribute("aria-pressed", "true");
            },
          },
          el("span", { class: "loop-chip__dot" }),
          this.t.types[id]
        )
      )
    );
    body.append(chips);

    // footer
    const submit = el("button", {
      class: "loop-submit",
      type: "button",
      disabled: !this.canSubmit(),
      onClick: () => this.doSubmit(),
      html: `${icons.send}<span>${this.t.send}</span>`,
    }) as HTMLButtonElement;

    const who = this.config.user?.name ? `${this.config.user.name} · ` : "";
    const foot = el(
      "div",
      { class: "loop-foot" },
      el(
        "div",
        { class: "loop-meta" },
        el("div", { class: "loop-meta__row" }, el("b", {}, this.t.from), " ", location.pathname),
        el("div", { class: "loop-meta__row" }, who + browserLabel())
      ),
      submit
    );

    return el("div", { class: "loop-panel", role: "dialog", "aria-label": this.t.title }, this.head(), body, foot);
  }

  private choices(): HTMLElement {
    const choice = (icon: string, title: string, desc: string, onClick: () => void) =>
      el(
        "button",
        { class: "loop-choice", type: "button", onClick },
        el("span", { class: "loop-choice__ico", html: icon }),
        el("span", { class: "loop-choice__t" }, title),
        el("span", { class: "loop-choice__d" }, desc)
      );
    return el(
      "div",
      { class: "loop-choices" },
      choice(icons.camera, this.t.fullPage, this.t.fullPageDesc, () => this.capture("full")),
      choice(icons.crop, this.t.selectArea, this.t.selectAreaDesc, () => this.capture("region"))
    );
  }

  private preview(): HTMLElement {
    const src = this.annotated ?? this.shot!.canvas.toDataURL("image/png");
    const btn = (icon: string, label: string, cls: string, onClick: () => void) =>
      el("button", { class: `loop-preview__btn ${cls}`, type: "button", onClick, html: `${icon}<span>${label}</span>` });
    return el(
      "div",
      { class: "loop-preview" },
      el("img", { src, alt: this.t.screenshot }),
      el(
        "div",
        { class: "loop-preview__bar" },
        btn(icons.edit, this.annotated ? this.t.editMarks : this.t.annotate, "is-primary", () => this.set("annotating")),
        btn(icons.retake, this.t.retake, "", () => this.capture("full")),
        btn(icons.trash, this.t.remove, "", () => {
          this.shot = null;
          this.annotated = null;
          this.set("compose");
        })
      )
    );
  }

  private statePanel(kind: "sending" | "success" | "error"): HTMLElement {
    let content: HTMLElement;
    if (kind === "sending") {
      content = el(
        "div",
        { class: "loop-state" },
        el("div", { class: "loop-state__icon" }, el("div", { class: "loop-spinner" })),
        el("div", { class: "loop-state__title" }, this.t.sending),
        el("div", { class: "loop-state__sub" }, this.t.sendingSub)
      );
    } else if (kind === "success") {
      content = el(
        "div",
        { class: "loop-state" },
        el(
          "div",
          { class: "loop-state__icon" },
          el("span", { class: "loop-ray" }),
          el("div", { class: "loop-burst", html: icons.check })
        ),
        el("div", { class: "loop-state__title" }, this.t.successTitle),
        el("div", { class: "loop-state__sub" }, this.t.successSub)
      );
    } else {
      content = el(
        "div",
        { class: "loop-state" },
        el("div", { class: "loop-error-icon", html: icons.alert }),
        el("div", { class: "loop-state__title" }, this.t.errorTitle),
        el("div", { class: "loop-state__sub" }, this.errorMsg || this.t.errorSub),
        el(
          "div",
          { class: "loop-state__actions" },
          el("button", { class: "loop-ghostbtn", type: "button", onClick: () => this.set("compose") }, this.t.back),
          el("button", { class: "loop-submit", type: "button", onClick: () => this.doSubmit(), html: `${icons.retake}<span>${this.t.tryAgain}</span>` })
        )
      );
    }
    return el("div", { class: "loop-panel", role: "dialog", "aria-label": this.t.title }, this.head(), content);
  }

  // ---- capture + region select --------------------------------------------
  private async capture(mode: "full" | "region") {
    this.errorMsg = "";
    try {
      const shot = await captureViewport(this.hostEl);
      this.shot = shot;
      this.annotated = null;
      if (mode === "region") this.set("selecting");
      else this.set("compose");
    } catch (err) {
      this.errorMsg = this.t.captureFailed;
      this.set("compose");
      // eslint-disable-next-line no-console
      console.error("[loop] capture failed", err);
    }
  }

  private renderSelect() {
    const shot = this.shot!;
    const img = el("img", { class: "loop-select__img", src: shot.canvas.toDataURL("image/png"), alt: "" });
    const veil = el("div", { class: "loop-select__veil" });
    const rect = el("div", { class: "loop-select__rect", style: { display: "none" } });
    const layer = el("div", { class: "loop-select" }, img, veil, rect);
    const hint = el(
      "div",
      { class: "loop-hint" },
      el("span", { class: "loop-hint__mark", html: icons.crop }),
      this.t.dragHint,
      el("kbd", {}, "Esc"),
      this.t.escToCancel
    );
    this.overlay = el("div", { class: "loop-overlay" }, layer, hint);
    this.root.appendChild(this.overlay);

    let start: { x: number; y: number } | null = null;
    const clamp = (v: number, max: number) => Math.max(0, Math.min(v, max));
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      start = { x: clamp(e.clientX, shot.cssWidth), y: clamp(e.clientY, shot.cssHeight) };
      veil.style.display = "none";
      rect.style.display = "block";
    };
    const onMove = (e: PointerEvent) => {
      if (!start) return;
      const cx = clamp(e.clientX, shot.cssWidth);
      const cy = clamp(e.clientY, shot.cssHeight);
      const x = Math.min(start.x, cx);
      const y = Math.min(start.y, cy);
      Object.assign(rect.style, { left: `${x}px`, top: `${y}px`, width: `${Math.abs(cx - start.x)}px`, height: `${Math.abs(cy - start.y)}px` });
    };
    const onUp = (e: PointerEvent) => {
      if (!start) return;
      const cx = clamp(e.clientX, shot.cssWidth);
      const cy = clamp(e.clientY, shot.cssHeight);
      const r: Rect = { x: Math.min(start.x, cx), y: Math.min(start.y, cy), w: Math.abs(cx - start.x), h: Math.abs(cy - start.y) };
      start = null;
      if (r.w > 12 && r.h > 12) {
        this.shot = cropShot(shot, r);
        this.set("annotating");
      } else {
        veil.style.display = "";
        rect.style.display = "none";
      }
    };
    layer.addEventListener("pointerdown", onDown);
    layer.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    this.bindEsc(() => this.set("compose"));
  }

  // ---- annotate ------------------------------------------------------------
  private renderAnnotate() {
    const shot = this.shot!;
    const wrap = el("div", { class: "loop-annot__canvaswrap" });
    const stage = el("div", { class: "loop-annot__stage" }, wrap);

    this.annotator = new Annotator(shot.canvas, {
      color: this.readAccentHex(),
      onChange: () => (undoBtn.disabled = !this.annotator!.canUndo),
    });

    const toolBtn = (tool: Tool, icon: string, label: string) =>
      el("button", {
        class: "loop-tool",
        type: "button",
        "aria-pressed": String(tool === "box"),
        "aria-label": label,
        title: label,
        onClick: (e: Event) => {
          this.annotator!.setTool(tool);
          toolbar.querySelectorAll(".loop-tool[data-tool]").forEach((b) => b.setAttribute("aria-pressed", "false"));
          (e.currentTarget as HTMLElement).setAttribute("aria-pressed", "true");
        },
        "data-tool": tool,
        html: icon,
      });

    const undoBtn = el("button", {
      class: "loop-tool",
      type: "button",
      disabled: true,
      "aria-label": this.t.undo,
      title: this.t.undo,
      onClick: () => this.annotator!.undo(),
      html: icons.undo,
    }) as HTMLButtonElement;

    const toolbar = el(
      "div",
      { class: "loop-toolbar", role: "toolbar", "aria-label": this.t.toolbarAria },
      toolBtn("box", icons.box, this.t.toolBox),
      toolBtn("arrow", icons.arrow, this.t.toolArrow),
      toolBtn("pin", icons.pin, this.t.toolPin),
      el("span", { class: "loop-toolbar__sep" }),
      undoBtn,
      el("span", { class: "loop-toolbar__sep" }),
      el("button", { class: "loop-tool", type: "button", onClick: () => this.set("compose") }, this.t.cancel),
      el("button", {
        class: "loop-tool is-cta",
        type: "button",
        onClick: () => {
          this.annotated = this.annotator!.toDataURL();
          this.set("compose");
        },
        html: `${icons.check}<span>${this.t.done}</span>`,
      })
    );

    this.overlay = el("div", { class: "loop-annot" }, toolbar, stage);
    this.root.appendChild(this.overlay);
    this.annotator.mount(wrap);
    this.annotator.setTool("box");
    this.bindEsc(() => this.set("compose"));
  }

  // ---- submit --------------------------------------------------------------
  private canSubmit() {
    return this.message.trim().length > 0 || !!this.shot;
  }

  private async doSubmit() {
    const payload: FeedbackPayload = {
      type: this.type,
      message: this.message.trim(),
      screenshot: this.annotated ?? this.shot?.canvas.toDataURL("image/png") ?? null,
      context: buildContext(),
      user: this.config.user,
      projectKey: this.config.projectKey,
      metadata: this.config.metadata,
    };
    this.set("sending");
    try {
      await ship(payload, this.config);
      this.set("success");
      window.setTimeout(() => {
        if (this.screen === "success") {
          this.reset();
          this.close();
        }
      }, 2000);
    } catch (err) {
      this.errorMsg = err instanceof Error ? err.message : "Network error.";
      this.set("error");
    }
  }

  // ---- helpers -------------------------------------------------------------
  private bindEsc(fn: () => void) {
    this.keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") fn();
    };
    window.addEventListener("keydown", this.keyHandler);
  }

  private readAccentHex(): string {
    // Annotations are drawn on a raw canvas; resolve the accent to a concrete
    // color the 2D context always understands.
    if (this.config.accent) return this.config.accent;
    return "#F6A623";
  }
}
