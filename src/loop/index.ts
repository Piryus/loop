import { styles } from "./styles";
import { LoopWidget } from "./widget";
import type { LoopConfig } from "./types";

export type { LoopConfig, FeedbackPayload, FeedbackType } from "./types";

let instance: HTMLElement | null = null;

/**
 * Mounts Loop into the page. Everything renders inside a shadow root, so the
 * host page's CSS can neither style nor be styled by the widget.
 */
export function init(config: LoopConfig = {}): void {
  if (instance) return;

  const mount = () => {
    const host = document.createElement("div");
    host.setAttribute("data-loop-root", "");
    host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483000;";
    instance = host;

    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = styles;
    const root = document.createElement("div");
    root.className = "loop-root";
    root.setAttribute("data-pos", config.position ?? "bottom-right");
    shadow.append(style, root);

    applyTheme(host, config);
    document.body.appendChild(host);
    new LoopWidget(root, host, config);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
}

/** Removes the widget entirely. */
export function destroy(): void {
  instance?.remove();
  instance = null;
}

function applyTheme(host: HTMLElement, config: LoopConfig) {
  const set = (t: "light" | "dark") => host.setAttribute("data-theme", t);
  if (config.theme && config.theme !== "auto") return set(config.theme);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  set(mq.matches ? "dark" : "light");
  mq.addEventListener("change", (e) => set(e.matches ? "dark" : "light"));
}
