type Props = Record<string, unknown>;
type Child = Node | string | null | false | undefined;

/** Minimal hyperscript for building shadow-DOM nodes without a framework. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Props,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = String(v);
      else if (k === "html") node.innerHTML = String(v);
      else if (k === "style" && typeof v === "object") Object.assign(node.style, v as object);
      else if (k.startsWith("on") && typeof v === "function")
        node.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      else if (k in node && k !== "list") (node as Record<string, unknown>)[k] = v;
      else node.setAttribute(k, String(v));
    }
  }
  for (const c of children) {
    if (c == null || c === false) continue;
    node.append(c as Node | string);
  }
  return node;
}
