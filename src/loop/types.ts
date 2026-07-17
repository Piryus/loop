export type FeedbackType = "bug" | "idea" | "question" | "praise";

export interface LoopConfig {
  /** Endpoint that receives the submission and creates the Linear issue. */
  endpoint?: string;
  /** Project key sent with every submission so the backend can route it. */
  projectKey?: string;
  /** Widget position. Default: bottom-right. */
  position?: "bottom-right" | "bottom-left";
  /** Force a theme; otherwise follows the host's prefers-color-scheme. */
  theme?: "light" | "dark" | "auto";
  /** Force a locale (e.g. "fr"); otherwise follows navigator.language. */
  locale?: string;
  /** Known submitter (e.g. logged-in user) attached to the report. */
  user?: { name?: string; email?: string; id?: string };
  /** Extra metadata merged into every submission (app version, route, …). */
  metadata?: Record<string, string>;
  /** Accent color override (OKLCH/any CSS color). Defaults to Loop amber. */
  accent?: string;
  /** Called on submit; may return a promise the widget awaits before success. */
  onSubmit?: (payload: FeedbackPayload) => void | Promise<void>;
}

export interface CaptureContext {
  url: string;
  userAgent: string;
  viewport: { width: number; height: number };
  language: string;
  capturedAt: string;
}

export interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  /** Annotated screenshot as a PNG data URL, when the user attached one. */
  screenshot: string | null;
  context: CaptureContext;
  user?: LoopConfig["user"];
  projectKey?: string;
  metadata?: Record<string, string>;
}

export type Screen =
  | "closed"
  | "compose"
  | "selecting" // dragging a region over the frozen page
  | "annotating"
  | "sending"
  | "success"
  | "error";
