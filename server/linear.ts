/**
 * Reference backend: turn a Loop submission into a Linear issue with the
 * annotated screenshot attached. Framework-agnostic — call `createLinearIssue`
 * from any handler (see server/README.md for a Next.js / Vercel / Node example).
 *
 * Env:
 *   LINEAR_API_KEY   Personal API key for the dedicated feedback workspace.
 *   LINEAR_TEAM_ID   Team the issues are filed under.
 *
 * Nothing here is Loop-specific beyond the payload shape, and no key ever
 * reaches the browser — the widget POSTs to your endpoint, your endpoint holds
 * the key and talks to Linear.
 */

const LINEAR_API = "https://api.linear.app/graphql";

export interface LoopSubmission {
  type: "bug" | "idea" | "question" | "praise";
  message: string;
  screenshot: string | null; // PNG data URL
  context: {
    url: string;
    userAgent: string;
    viewport: { width: number; height: number };
    language: string;
    capturedAt: string;
  };
  user?: { name?: string; email?: string; id?: string };
  projectKey?: string;
  metadata?: Record<string, string>;
}

interface LinearEnv {
  apiKey: string;
  /** Optional — auto-discovered when the workspace has a single team. */
  teamId?: string;
}

const TYPE_EMOJI: Record<LoopSubmission["type"], string> = {
  bug: "🐞",
  idea: "💡",
  question: "❓",
  praise: "💛",
};

async function gql<T>(env: LinearEnv, query: string, variables: object): Promise<T> {
  const res = await fetch(LINEAR_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: env.apiKey },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Linear returned no data");
  return json.data;
}

/** Uploads a data-URL PNG to Linear's asset store, returns the public asset URL. */
async function uploadScreenshot(env: LinearEnv, dataUrl: string): Promise<string | null> {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  const [, contentType, b64] = match;
  const bytes = Buffer.from(b64, "base64");
  const filename = `loop-${Date.now()}.png`;

  const { fileUpload } = await gql<{
    fileUpload: { success: boolean; uploadFile: { uploadUrl: string; assetUrl: string; headers: { key: string; value: string }[] } };
  }>(
    env,
    `mutation Upload($contentType: String!, $filename: String!, $size: Int!) {
      fileUpload(contentType: $contentType, filename: $filename, size: $size) {
        success
        uploadFile { uploadUrl assetUrl headers { key value } }
      }
    }`,
    { contentType, filename, size: bytes.byteLength }
  );

  const { uploadUrl, assetUrl, headers } = fileUpload.uploadFile;
  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000",
      ...Object.fromEntries(headers.map((h) => [h.key, h.value])),
    },
    body: bytes,
  });
  if (!put.ok) throw new Error(`Asset upload failed (${put.status})`);
  return assetUrl;
}

function buildDescription(s: LoopSubmission, assetUrl: string | null): string {
  const lines: string[] = [];
  if (s.message) lines.push(s.message, "");
  if (assetUrl) lines.push(`![screenshot](${assetUrl})`, "");
  lines.push("---");
  lines.push(`**Page** · ${s.context.url}`);
  lines.push(`**Reporter** · ${s.user?.name ?? "Anonymous"}${s.user?.email ? ` (${s.user.email})` : ""}`);
  lines.push(`**Browser** · ${s.context.userAgent}`);
  lines.push(`**Viewport** · ${s.context.viewport.width}×${s.context.viewport.height} · ${s.context.language}`);
  lines.push(`**When** · ${s.context.capturedAt}`);
  if (s.projectKey) lines.push(`**Project** · ${s.projectKey}`);
  for (const [k, v] of Object.entries(s.metadata ?? {})) lines.push(`**${k}** · ${v}`);
  return lines.join("\n");
}

/** Explicit team id, else the workspace's single team (dedicated-workspace case). */
async function resolveTeamId(env: LinearEnv): Promise<string> {
  if (env.teamId) return env.teamId;
  const { teams } = await gql<{ teams: { nodes: { id: string }[] } }>(
    env,
    `query { teams(first: 2) { nodes { id } } }`,
    {}
  );
  if (teams.nodes.length === 0) throw new Error("No team in this Linear workspace");
  return teams.nodes[0].id;
}

/** Creates the Linear issue. Returns the issue URL. */
export async function createLinearIssue(submission: LoopSubmission, env: LinearEnv): Promise<string> {
  const [teamId, assetUrl] = await Promise.all([
    resolveTeamId(env),
    submission.screenshot ? uploadScreenshot(env, submission.screenshot) : Promise.resolve(null),
  ]);
  const title = `${TYPE_EMOJI[submission.type]} ${truncate(submission.message || submission.type, 80)}`;

  const { issueCreate } = await gql<{ issueCreate: { success: boolean; issue: { url: string } } }>(
    env,
    `mutation Create($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { url } }
    }`,
    { input: { teamId, title, description: buildDescription(submission, assetUrl) } }
  );

  if (!issueCreate.success) throw new Error("Linear issueCreate failed");
  return issueCreate.issue.url;
}

function truncate(s: string, n: number): string {
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? `${clean.slice(0, n - 1)}…` : clean;
}

export function readEnv(): LinearEnv {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) throw new Error("Set LINEAR_API_KEY");
  // LINEAR_TEAM_ID optional — only needed if the workspace has multiple teams.
  return { apiKey, teamId: process.env.LINEAR_TEAM_ID || undefined };
}
