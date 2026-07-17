# Loop backend (reference)

A single stateless endpoint that receives a submission from the widget and files
it as a Linear issue with the annotated screenshot attached. No database, no
dashboard — Linear *is* the triage board.

`linear.ts` holds the reusable logic (`createLinearIssue`). Wire it to whatever
runtime you host.

## Setup

1. Create a **dedicated Linear workspace** for feedback (so you can invite the
   host app's team without exposing your other work). Add one team, e.g. `Feedback`.
2. Create a **personal API key** in that workspace (Settings → API).
3. Set env vars:
   ```
   LINEAR_API_KEY=lin_api_xxx
   # LINEAR_TEAM_ID=<team uuid>   # optional — auto-discovered when the
   #                               # workspace has a single team
   ```
4. Point the widget at your endpoint:
   ```js
   Loop.init({ endpoint: "https://your-host/api/feedback", projectKey: "acme" });
   ```

## Example — Next.js App Router (`app/api/feedback/route.ts`)

```ts
import { NextRequest, NextResponse } from "next/server";
import { createLinearIssue, readEnv, type LoopSubmission } from "@/server/linear";

export async function POST(req: NextRequest) {
  try {
    const submission = (await req.json()) as LoopSubmission;
    const url = await createLinearIssue(submission, readEnv());
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
```

## Example — Node / Express

```ts
import express from "express";
import { createLinearIssue, readEnv } from "./server/linear";

const app = express();
app.use(express.json({ limit: "8mb" })); // screenshots are data URLs
app.post("/api/feedback", async (req, res) => {
  try {
    const url = await createLinearIssue(req.body, readEnv());
    res.json({ ok: true, url });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});
app.listen(8787);
```

## Notes

- **CORS**: if the host app is on a different origin than the endpoint, allow it
  (`Access-Control-Allow-Origin`). Restrict to your known host origins.
- **Payload size**: annotated PNGs are sent as data URLs; allow ~8MB bodies.
- **Abuse**: for public/anonymous reporters, add rate limiting and (optionally) a
  hCaptcha/Turnstile check in front of this endpoint.
- **Swappable target**: nothing forces Linear. Replace `createLinearIssue` with a
  GitHub Issues / Slack / email sink and the widget is unchanged.
