/**
 * The reporter's name, typed once in the widget and remembered in a
 * first-party cookie so shared or logged-out sessions still say who wrote.
 * The cookie holds the name only, nothing else.
 */

export const REPORTER_COOKIE = "loop_reporter";
/** 15 days, refreshed on every send. */
export const REPORTER_MAX_AGE = 15 * 24 * 60 * 60;
export const REPORTER_MAX_LENGTH = 80;

/** Trims, collapses whitespace, drops control characters, caps the length. */
export function cleanReporter(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const clean = raw.replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, " ").replace(/\s+/g, " ").trim();
  return Array.from(clean).slice(0, REPORTER_MAX_LENGTH).join("").trim();
}

/** Reads the name from a `document.cookie` string; malformed values read as no name. */
export function parseReporterCookie(cookieHeader: string): string | null {
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0 || part.slice(0, eq).trim() !== REPORTER_COOKIE) continue;
    try {
      return cleanReporter(decodeURIComponent(part.slice(eq + 1).trim())) || null;
    } catch {
      return null;
    }
  }
  return null;
}

/** The `document.cookie` assignment that stores the name for another 15 days. */
export function serializeReporterCookie(name: string, secure: boolean): string {
  const attrs = [
    `${REPORTER_COOKIE}=${encodeURIComponent(cleanReporter(name))}`,
    `Max-Age=${REPORTER_MAX_AGE}`,
    "Path=/",
    "SameSite=Lax",
  ];
  if (secure) attrs.push("Secure");
  return attrs.join("; ");
}

export function readReporter(): string | null {
  try {
    return parseReporterCookie(document.cookie);
  } catch {
    return null;
  }
}

export function storeReporter(name: string): void {
  if (!cleanReporter(name)) return;
  try {
    document.cookie = serializeReporterCookie(name, location.protocol === "https:");
  } catch {
    // Cookies disabled or sandboxed: the name is simply asked again next time.
  }
}
