import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("the built ESM and CJS SDK surfaces preserve controllers, path prefix, and auth", async (context) => {
  const requests = [];
  const payload = { data: [], meta: { nextCursor: null } };
  const server = createServer((request, response) => {
    requests.push({ method: request.method, url: request.url, headers: request.headers });
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(payload));
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  context.after(() => new Promise((resolveClose) => server.close(resolveClose)));
  const address = server.address();
  assert(address && typeof address === "object");

  const esm = await import(
    `${pathToFileURL(resolve(repositoryRoot, "dist/index.mjs")).href}?e2e=${Date.now()}`
  );
  const client = esm.createPinhereClient({
    accessToken: "fixture-access-token",
    baseUrl: `http://127.0.0.1:${address.port}/api/v1`,
  });
  assert.deepEqual(await client.issues.listIssues({ limit: 10 }), payload);
  assert.equal(requests[0].method, "GET");
  assert.equal(requests[0].url, "/api/v1/issues?limit=10");
  assert.equal(requests[0].headers.authorization, "Bearer fixture-access-token");

  const require = createRequire(import.meta.url);
  const cjs = require(resolve(repositoryRoot, "dist/index.js"));
  assert.equal(typeof cjs.createPinhereClient, "function");
  assert(cjs.default.issues);
});

test("the built CLI exposes all 34 Endpoints and six source Controllers", async () => {
  const cli = resolve(repositoryRoot, "dist/bin/cli.cjs");
  const { stdout: help } = await execFileAsync(process.execPath, [cli, "--help"], {
    cwd: repositoryRoot,
  });
  assert.match(help, /pontx-pinhere/);
  const { stdout: endpoints } = await execFileAsync(process.execPath, [cli, "list", "apis"], {
    cwd: repositoryRoot,
  });
  assert.equal(endpoints.trim().split("\n").length, 34);
  for (const expected of [
    "issues.createIssue", "attachments.downloadAttachment", "oauth.exchangeOAuthToken",
  ]) assert.match(endpoints, new RegExp(expected));
  assert.doesNotMatch(endpoints, /common\.|default\./);
});

test("the CLI redacts private Pinhere fields and enforces exact mutation confirmation", async (context) => {
  const requests = [];
  const server = createServer((request, response) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", () => {
      requests.push({ method: request.method, url: request.url, headers: request.headers, body });
      response.writeHead(201, { "content-type": "application/json" });
      response.end(JSON.stringify({ data: { id: "iss_fixture" } }));
    });
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  context.after(() => new Promise((resolveClose) => server.close(resolveClose)));
  const address = server.address();
  assert(address && typeof address === "object");

  const privateDescription = "fixture-private-description-never-preview";
  const privateHtml = "<button>fixture-private-dom-never-preview</button>";
  const body = {
    projectId: "prj_fixture",
    title: "fixture-private-title-never-preview",
    description: privateDescription,
    pageUrl: "https://private.example.test/checkout",
    dom: {
      cssSelector: "#checkout",
      xpath: "//*[@id='checkout']",
      tagName: "BUTTON",
      attributes: { id: "checkout" },
      text: "fixture-private-text-never-preview",
      outerHTML: privateHtml,
      viewport: { width: 1440, height: 900, devicePixelRatio: 2 },
      boundingRect: { x: 10, y: 10, width: 100, height: 40 },
    },
    source: "api",
  };
  const args = [
    resolve(repositoryRoot, "dist/bin/cli.cjs"),
    "call", "issues", "createIssue",
    "--body", JSON.stringify(body),
    "--env", `http://127.0.0.1:${address.port}/api/v1`,
  ];
  const env = { ...process.env, PINHERE_ACCESS_TOKEN: "fixture-access-token-never-log" };

  const preview = await execFileAsync(process.execPath, [...args, "--dry-run", "--curl"], {
    cwd: repositoryRoot,
    env,
  });
  const previewOutput = `${preview.stdout}\n${preview.stderr}`;
  assert.equal(requests.length, 0);
  assert.match(previewOutput, /authorization: <redacted>/i);
  assert.match(previewOutput, /description.*<redacted>/i);
  for (const secret of [
    env.PINHERE_ACCESS_TOKEN,
    privateDescription,
    privateHtml,
    body.title,
    body.pageUrl,
  ]) assert.doesNotMatch(previewOutput, new RegExp(secret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  const token = previewOutput.match(/ptx1\.\d+\.[a-f0-9]{64}/)?.[0];
  assert(token, "dry-run did not return a mutation confirmation token");

  await assert.rejects(
    execFileAsync(process.execPath, args, { cwd: repositoryRoot, env }),
    (error) => /Mutation blocked/.test(`${error.stdout}\n${error.stderr}`),
  );
  assert.equal(requests.length, 0);

  const changedArgs = args.map((argument) =>
    argument.includes(privateDescription)
      ? argument.replace(privateDescription, "changed-private-description")
      : argument,
  );
  await assert.rejects(
    execFileAsync(process.execPath, [...changedArgs, "--confirm", token], {
      cwd: repositoryRoot,
      env,
    }),
    (error) => /Mutation blocked/.test(`${error.stdout}\n${error.stderr}`),
  );
  assert.equal(requests.length, 0);

  const executed = await execFileAsync(process.execPath, [...args, "--confirm", token], {
    cwd: repositoryRoot,
    env,
  });
  assert.match(executed.stdout, /iss_fixture/);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].method, "POST");
  assert.equal(requests[0].url, "/api/v1/issues");
  assert.equal(requests[0].headers.authorization, "Bearer fixture-access-token-never-log");
  assert.deepEqual(JSON.parse(requests[0].body), body);
});
