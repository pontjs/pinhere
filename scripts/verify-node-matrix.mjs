import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const smoke = resolve("test/e2e/matrix-smoke.cjs");
const builtPackageE2e = resolve("test/e2e/sdk.test.mjs");
const vitest = resolve("node_modules/vitest/vitest.mjs");

function run(major, args, label) {
  const result = spawnSync(npx, ["--yes", `node@${major}`, ...args], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
  assert.equal(result.status, 0,
    `Node ${major} ${label} failed:\n${result.stdout}\n${result.stderr}`);
  return result;
}

for (const major of [18, 20, 22]) {
  run(major, [vitest, "run", "test/unit", "--reporter=dot"], "unit tests");
  run(major, ["--test", builtPackageE2e], "built-package E2E");
  const result = run(major, [smoke], "CJS/declarations/CLI smoke");
  assert.match(result.stdout, new RegExp(`^Node v${major}\\.`));
  process.stdout.write(result.stdout);
}
console.log("Node 18/20/22 matrix passed: unit, built-package E2E, CJS, declarations, and CLI.");
