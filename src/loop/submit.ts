import type { FeedbackPayload, LoopConfig } from "./types";

/**
 * Ships a submission. Order of preference:
 *  1. config.endpoint — POST JSON to the backend, which creates the Linear issue.
 *  2. config.onSubmit — host-provided handler (also used by the demo).
 *  3. console fallback so the widget is inspectable with no backend wired up.
 */
export async function ship(payload: FeedbackPayload, config: LoopConfig): Promise<void> {
  if (config.endpoint) {
    const res = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Loop endpoint responded ${res.status}`);
    if (config.onSubmit) config.onSubmit(payload);
    return;
  }
  if (config.onSubmit) {
    await config.onSubmit(payload);
    return;
  }
  // eslint-disable-next-line no-console
  console.info("[loop] feedback (no endpoint configured):", payload);
}
