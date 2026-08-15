import { createPinhereClient } from "../../dist/index.mjs";

const client = createPinhereClient({
  accessToken: "fixture-access-token",
  fetchImpl: async () => new Response("{}", { headers: { "content-type": "application/json" } }),
});

client.projects.listProjects();
client.projects.getProject("prj_fixture");
client.issues.listIssues({ limit: 10, status: "open" });
client.issues.getIssue("iss_fixture");
client.attachments.downloadAttachment("att_fixture");
client.oauth.exchangeOAuthToken({
  grantType: "authorization_code",
  code: "fixture-code",
  redirectUri: "https://example.chromiumapp.org/callback",
  codeVerifier: "fixture-verifier",
});

// @ts-expect-error Controllers must come only from explicit PontxSpec tags.
client.common.listIssues({});
// @ts-expect-error The canonical list limit is numeric.
client.issues.listIssues({ limit: "10" });
