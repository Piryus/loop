import { init } from "./loop";

// Demo harness: mounts Loop over the mock host app. `?theme=light|dark` forces
// a theme for screenshots; otherwise it follows the system preference.
const params = new URLSearchParams(location.search);
const theme = params.get("theme") as "light" | "dark" | null;
const lang = params.get("lang");

init({
  theme: theme ?? "auto",
  locale: lang ?? undefined,
  projectKey: "demo",
  user: { name: "Luana Morin", email: "luana@example.org" },
  metadata: { app: "northwind-expenses", version: "1.4.0" },
  onSubmit: async (payload) => {
    // No backend in the demo — log the payload and simulate network latency
    // so the sending/success states are visible.
    console.info("[demo] would create Linear issue:", payload);
    await new Promise((r) => setTimeout(r, 1100));
  },
});
