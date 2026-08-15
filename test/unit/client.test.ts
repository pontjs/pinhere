import { describe, expect, it, vi } from "vitest";
import {
  createPinhereClient,
  PinhereHttpError,
} from "../../src/index";
import {
  authorizePinhereRequest,
  resolvePinhereCredentialHeaders,
} from "../../src/runtime";

describe("@pontx/pinhere", () => {
  it("requires exactly one caller-owned credential", () => {
    expect(() => resolvePinhereCredentialHeaders()).toThrow(/PINHERE_ACCESS_TOKEN/);
    expect(() => resolvePinhereCredentialHeaders({
      accessToken: "fixture-access-token",
      sessionCookie: "fixture-session",
    })).toThrow(/only one/);
    expect(resolvePinhereCredentialHeaders({ accessToken: "fixture-access-token" }))
      .toEqual({ Authorization: "Bearer fixture-access-token" });
    expect(resolvePinhereCredentialHeaders({ sessionCookie: "fixture-session" }))
      .toEqual({ Cookie: "fixture-session" });
  });

  it("attaches credentials only immediately before execution", () => {
    const authorized = authorizePinhereRequest({
      method: "GET",
      headers: { Accept: "application/json" },
    }, { accessToken: "fixture-access-token" });
    expect(new Headers(authorized.headers).get("Authorization"))
      .toBe("Bearer fixture-access-token");
  });

  it("exposes only the six explicit PontxSpec Controllers", () => {
    const client = createPinhereClient({
      accessToken: "fixture-access-token",
      fetchImpl: vi.fn() as unknown as typeof fetch,
    });
    const keys = Object.keys(client);
    expect(keys.filter((key) => !key.includes("/")).sort()).toEqual([
      "attachments", "issues", "oauth", "projects", "tokens", "webhooks",
    ]);
    expect(keys.filter((key) => key.includes("/"))).toHaveLength(34);
    expect("common" in client).toBe(false);
    expect("default" in client).toBe(false);
  });

  it("serializes query parameters and PAT authentication", async () => {
    const payload = { data: [], meta: { nextCursor: null } };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const client = createPinhereClient({
      accessToken: "fixture-access-token",
      fetchImpl: fetchMock,
    });

    await expect(client.issues.listIssues({ limit: 10, status: "open" }))
      .resolves.toEqual(payload);
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe("https://pinhere-jasonhzqs-projects.vercel.app/api/v1/issues?limit=10&status=open");
    expect(init.method).toBe("GET");
    expect(init.body).toBeUndefined();
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer fixture-access-token");
  });

  it("supports website-session authentication", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    const client = createPinhereClient({ sessionCookie: "fixture-session", fetchImpl: fetchMock });
    await client.projects.listProjects();
    const [, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(new Headers(init.headers).get("Cookie")).toBe("fixture-session");
    expect(new Headers(init.headers).has("Authorization")).toBe(false);
  });

  it("keeps the OAuth token exchange anonymous and JSON encoded", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: {
        accessToken: "fixture-returned-access",
        refreshToken: "fixture-returned-refresh",
        expiresIn: 900,
        tokenType: "Bearer",
        scopes: ["projects:read"],
      },
    }), { status: 200, headers: { "content-type": "application/json" } }));
    const client = createPinhereClient({ fetchImpl: fetchMock });
    await client.oauth.exchangeOAuthToken({
      grantType: "authorization_code",
      code: "fixture-code",
      redirectUri: "https://example.chromiumapp.org/callback",
      codeVerifier: "fixture-verifier",
    });
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe("https://pinhere-jasonhzqs-projects.vercel.app/api/v1/oauth/token");
    expect(new Headers(init.headers).has("Authorization")).toBe(false);
    expect(new Headers(init.headers).has("Cookie")).toBe(false);
    expect(JSON.parse(String(init.body))).toMatchObject({ grantType: "authorization_code" });
  });

  it("preserves private image responses as Blob values", async () => {
    const bytes = new Uint8Array([0x52, 0x49, 0x46, 0x46]);
    const fetchMock = vi.fn().mockResolvedValue(new Response(bytes, {
      status: 200,
      headers: { "content-type": "image/webp" },
    }));
    const client = createPinhereClient({
      accessToken: "fixture-access-token",
      fetchImpl: fetchMock,
    });
    const image = await client.attachments.downloadAttachment("att_fixture");
    expect(image).toBeInstanceOf(Blob);
    expect([...new Uint8Array(await image.arrayBuffer())]).toEqual([...bytes]);
  });

  it("throws a typed HTTP error without including credentials in its message", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { code: "unauthorized", message: "Denied", requestId: "req_fixture" },
    }), { status: 401, headers: { "content-type": "application/json" } }));
    const client = createPinhereClient({
      accessToken: "fixture-access-token-never-log",
      fetchImpl: fetchMock,
    });
    await expect(client.issues.listIssues({})).rejects.toMatchObject<Partial<PinhereHttpError>>({
      name: "PinhereHttpError",
      status: 401,
      responseBody: {
        error: { code: "unauthorized", message: "Denied", requestId: "req_fixture" },
      },
    });
  });
});
