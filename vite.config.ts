import { defineConfig } from "vite";

// Dev config: serves the demo host page (index.html) with the widget mounted
// over it, so we can design and screenshot the overlay in a realistic context.
export default defineConfig({
  server: {
    port: 5273,
    host: true,
  },
});
