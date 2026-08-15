import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateGracefulClient } from "@pontx/sdk/plugin";

const directory = resolve("src/apis/pinhere");
const lock = JSON.parse(await readFile(resolve(directory, "api-lock.json"), "utf8"));
const canonical = JSON.parse(await readFile(resolve("pontx-spec.json"), "utf8"));
const expected = generateGracefulClient(lock);

for (const [name, content] of Object.entries(expected)) {
  const actual = await readFile(resolve(directory, name), "utf8");
  assert.equal(actual, content, `${name} is stale; regenerate from pontx-spec.json`);
}

assert.equal(Object.keys(lock.apis).length, 34);
assert.equal(Object.keys(lock.components.schemas).length, 36);
assert.deepEqual(lock, canonical, "api-lock.json is stale; run pnpm pontx with --use-remote");
assert.deepEqual(lock.tags.map(({ name }) => name).sort(), [
  "attachments", "issues", "oauth", "projects", "tokens", "webhooks",
]);
assert(!Object.prototype.hasOwnProperty.call(lock.apis, "common"));
assert(!Object.prototype.hasOwnProperty.call(lock.apis, "default"));
console.log(`Generated-source gate passed: ${Object.keys(expected).length} deterministic files and 6 explicit Controllers.`);
