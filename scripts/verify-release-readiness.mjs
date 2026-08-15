import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const packageJson = JSON.parse(await readFile(resolve("package.json"), "utf8"));
const provenance = JSON.parse(await readFile(resolve("source.provenance.json"), "utf8"));
const workspace = await readFile(resolve("pnpm-workspace.yaml"), "utf8");
const lockfile = await readFile(resolve("pnpm-lock.yaml"), "utf8");

assert.equal(packageJson.private, false,
  "Release blocked: package must remain private until licensing and canonical discovery gates pass.");
assert.notEqual(packageJson.license, "UNLICENSED",
  "Release blocked: Pinhere has not declared a redistribution license.");
assert.equal(typeof packageJson.repository?.url, "string",
  "Release blocked: the independent SDK repository is not established.");
assert.equal(provenance.source.license, packageJson.license,
  "Release blocked: package and contract provenance licenses differ.");
assert.equal(provenance.discovery.status, "verified",
  "Release blocked: canonical Pinhere discovery is not verified.");
assert(!/(?:^|\s)(?:link|file|workspace):|^\s*overrides\s*:/im.test(`${workspace}\n${lockfile}`),
  "Release blocked: local dependency links or workspace overrides remain.");

for (const [name, version] of Object.entries(packageJson.dependencies ?? {})) {
  assert.match(version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  let published;
  try {
    published = execFileSync("npm", ["view", `${name}@${version}`, "version", "--json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    throw new Error(`Release blocked: ${name}@${version} is unavailable in npm.`);
  }
  assert.equal(JSON.parse(published), version);
}
console.log("Release prerequisites verified: licensed public package, canonical discovery, and frozen registry graph.");
