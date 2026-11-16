import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cleanReporter,
  parseReporterCookie,
  serializeReporterCookie,
  REPORTER_MAX_AGE,
} from "../src/loop/reporter.ts";

test("the cookie keeps the name for 15 days, on the whole site", () => {
  assert.equal(REPORTER_MAX_AGE, 1296000);
  assert.equal(
    serializeReporterCookie("Marie Curie", true),
    "loop_reporter=Marie%20Curie; Max-Age=1296000; Path=/; SameSite=Lax; Secure",
  );
  assert.equal(
    serializeReporterCookie("  Élise ; Durand=x  ", false),
    "loop_reporter=%C3%89lise%20%3B%20Durand%3Dx; Max-Age=1296000; Path=/; SameSite=Lax",
  );
});

test("a stored name reads back, with or without other cookies", () => {
  const value = serializeReporterCookie("Élise ; Durand=x", false).split(";")[0];
  assert.equal(parseReporterCookie(value), "Élise ; Durand=x");
  assert.equal(parseReporterCookie(`theme=dark; ${value}; other=1`), "Élise ; Durand=x");
});

test("a missing, empty or malformed cookie means the name is asked again", () => {
  assert.equal(parseReporterCookie(""), null);
  assert.equal(parseReporterCookie("theme=dark"), null);
  assert.equal(parseReporterCookie("loop_reporter="), null);
  assert.equal(parseReporterCookie("loop_reporter=%20%20"), null);
  assert.equal(parseReporterCookie("loop_reporter=%E0%A4%A"), null);
  assert.equal(parseReporterCookie("xloop_reporter=Marie"), null);
});

test("names are trimmed, collapsed and capped", () => {
  assert.equal(cleanReporter("  Marie \n\t Curie\u0000 "), "Marie Curie");
  assert.equal(cleanReporter(undefined), "");
  assert.equal(cleanReporter("a".repeat(120)).length, 80);
});
