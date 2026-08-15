const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { resolve } = require("node:path");
const sdk = require(resolve("dist/index.js"));

assert.equal(typeof sdk.createPinhereClient, "function");
const keys = Object.keys(sdk.createPinhereClient({ accessToken: "fixture" }));
assert.deepEqual(keys.filter((key) => !key.includes("/")).sort(), [
  "attachments", "issues", "oauth", "projects", "tokens", "webhooks",
]);
assert.equal(keys.filter((key) => key.includes("/")).length, 34);
const cli = spawnSync(process.execPath, [resolve("dist/bin/cli.cjs"), "--help"], {
  encoding: "utf8",
});
assert.equal(cli.status, 0, cli.stderr);
assert.match(cli.stdout, /pontx-pinhere/);
console.log(`Node ${process.version}: CJS, declarations, and CLI smoke passed.`);
