import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDescription, sanitizeReporter, type LoopSubmission } from "../server/linear.ts";

const base: LoopSubmission = {
  type: "bug",
  message: "The button does nothing.",
  screenshot: null,
  context: {
    url: "https://app.example.org/settings",
    userAgent: "Mozilla/5.0",
    viewport: { width: 1280, height: 800 },
    language: "fr-FR",
    capturedAt: "2026-11-16T10:00:00.000Z",
  },
  user: { name: "Demo Admin", email: "demo@example.org" },
};

test("the typed name comes first in the metadata block, the account line stays", () => {
  const lines = buildDescription({ ...base, reporter: "Marie Curie" }, null).split("\n");
  const start = lines.indexOf("---");
  assert.equal(lines[start + 1], "**Tester** · Marie Curie");
  assert.equal(lines[start + 2], "**Page** · https://app.example.org/settings");
  assert.ok(lines.includes("**Reporter** · Demo Admin (demo@example.org)"));
});

test("without a name (older widgets), the line is left out", () => {
  for (const reporter of [undefined, "", "   ", "[]()"]) {
    assert.ok(!buildDescription({ ...base, reporter }, null).includes("**Tester**"));
  }
});

test("the name cannot inject Markdown into the issue", () => {
  assert.equal(sanitizeReporter("  Marie \n\n Curie  "), "Marie Curie");
  assert.equal(sanitizeReporter("Marie\u0000‮ Curie​"), "Marie Curie");
  assert.equal(sanitizeReporter("[click](https://evil.example)"), "click");
  assert.equal(sanitizeReporter("![x](https://evil.example/a.png) Bob"), "x Bob");
  assert.equal(sanitizeReporter("<https://evil.example> Bob"), "Bob");
  assert.equal(sanitizeReporter("Bob www.evil.example"), "Bob");
  assert.equal(sanitizeReporter("**Bob** _x_ `y`"), "\\*\\*Bob\\*\\* \\_x\\_ y");
  assert.equal(sanitizeReporter("[a]: https://evil.example"), "a :");
  assert.equal(sanitizeReporter("Marie (PCL)"), "Marie (PCL)");
  assert.equal(sanitizeReporter(42), null);
});

test("the name is capped at 80 characters", () => {
  assert.equal(sanitizeReporter("é".repeat(200)), "é".repeat(80));
});
