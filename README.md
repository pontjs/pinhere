# @pontx/pinhere

Type-safe Pinhere SDK and preview-first CLI generated only from Pinhere's
canonical PontxSpec.

This repository is a local release candidate generated from the public,
product-owned contract in [`jasonHzq/pinhere`](https://github.com/jasonHzq/pinhere).
It is not publishable yet: Pinhere declares no redistribution license, and
`pinhere.dev` plus `/.well-known/pontx.json` are not currently reachable. The
available Vercel Preview is not the canonical production origin. The package
intentionally remains `private` and `UNLICENSED` until those product-owned
gates are resolved.

## Safety boundary

- Calls go directly from the caller's process to Pinhere; Pontx Hub proxy
  execution is disabled for all Endpoints.
- Credentials remain in `PINHERE_ACCESS_TOKEN` or `PINHERE_SESSION_COOKIE` and
  are attached only immediately before network execution.
- Every POST, PATCH, and DELETE CLI call is preview-first and requires the
  short-lived confirmation token from the exact unchanged request.
- Private issue text, DOM context, screenshots, OAuth values, cookies, tokens,
  and one-time secrets are redacted from previews.

## SDK

```ts
import { createPinhereClient } from "@pontx/pinhere";

const client = createPinhereClient({
  accessToken: process.env.PINHERE_ACCESS_TOKEN,
});

const issues = await client.issues.listIssues({
  projectId: "prj_example",
  status: "open",
});
```

Use `sessionCookie` only for website-session Endpoints such as project,
Webhook, and PAT management. Never copy a browser session into Pontx Hub.

## CLI

```bash
export PINHERE_ACCESS_TOKEN='...'
pontx-pinhere list apis
pontx-pinhere call issues getIssue --issueId iss_example --dry-run
```

For a mutation, review the redacted preview and pass its unchanged `ptx1...`
confirmation token to the same command with `--confirm`.
