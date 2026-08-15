import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const bytes = await readFile(resolve("pontx-spec.json"));
const spec = JSON.parse(bytes);
const provenance = JSON.parse(await readFile(resolve("source.provenance.json"), "utf8"));
const entries = Object.entries(spec.apis ?? {});
const schemas = Object.keys(spec.components?.schemas ?? {});
const tags = new Set((spec.tags ?? []).map(({ name }) => name));

assert.equal(spec.pontx, "2.1");
assert.equal(spec.name, "pinhere");
assert.equal(spec.style, "RESTFul");
assert.deepEqual(spec.servers, [{
  id: "production",
  url: "https://pinhere.dev/api/v1",
  description: "Pinhere 生产 API。",
}]);
assert.equal(entries.length, 34);
assert.equal(schemas.length, 36);
assert.deepEqual([...tags].sort(), [
  "attachments", "issues", "oauth", "projects", "tokens", "webhooks",
]);
assert.equal(new Set(entries.map(([, api]) => api.operationId)).size, 34);

for (const [key, api] of entries) {
  const [tag, id, ...extra] = key.split("/");
  assert.equal(extra.length, 0, `${key}: hierarchy must be tag/operationId`);
  assert.equal(api.operationId, id, `${key}: unstable operationId`);
  assert.deepEqual(api.tags, [tag], `${key}: controller must come from its explicit tag`);
  assert(tags.has(tag), `${key}: undeclared tag`);
  assert.match(api.method, /^(GET|POST|PATCH|DELETE)$/);
  assert(api.path.startsWith("/"));
  assert.equal(api.metadata?.execution?.enabled, false, `${key}: Hub proxy must be disabled`);
  assert(api.metadata.execution.disabledReason.length > 20, `${key}: missing execution boundary`);
  assert(api.requestExamples?.default?.request, `${key}: request example missing`);
  assert(api.requestExamples.default.expectedStatus, `${key}: expected status missing`);
  for (const match of api.path.matchAll(/\{([^}]+)\}/g)) {
    const parameter = api.parameters?.find(({ in: location, name }) =>
      location === "path" && name === match[1]);
    assert.equal(parameter?.required, true, `${key}: path parameter ${match[1]} is not required`);
  }
}

assert.deepEqual(spec.apis["oauth/exchangeOAuthToken"].security, []);
assert(entries.filter(([key]) => key !== "oauth/exchangeOAuthToken")
  .every(([, api]) => Array.isArray(api.security) && api.security.length > 0));
assert.deepEqual(Object.keys(spec.components.securitySchemes).sort(), [
  "extensionOAuth", "pinherePat", "websiteSession",
]);
assert.equal(spec.components.securitySchemes.pinherePat.bearerFormat, "ph_pat_*");

const actualHash = createHash("sha256").update(bytes).digest("hex");
assert.equal(actualHash, provenance.source.sha256);
assert.equal(provenance.source.commit, "576e6f7160b5bb04d5856620def23c6bd3b25082");
assert.equal(provenance.output.operations, 34);
assert.equal(provenance.output.schemas, 36);
assert.equal(provenance.output.proxyDisabledOperations, 34);
assert.equal(provenance.source.license, "MIT");
assert(!/ph_pat_[A-Za-z0-9_-]{12,}/.test(bytes.toString("utf8")),
  "canonical contract contains a PAT-shaped value");

console.log(`Verified Pinhere contract ${actualHash}: 34 Endpoints, 36 Schemas, 6 explicit Controllers, zero Hub proxy operations.`);
