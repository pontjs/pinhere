import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const temporary = await mkdtemp(join(tmpdir(), "pontx-pinhere-pack-"));

try {
  const { stdout } = await execFileAsync("npm", [
    "pack", "--json", "--pack-destination", temporary,
  ], { cwd: root, maxBuffer: 10 * 1024 * 1024 });
  const [packed] = JSON.parse(stdout);
  const files = new Set(packed.files.map(({ path }) => path));
  for (const expected of [
    "README.md",
    "dist/index.d.ts",
    "dist/index.js",
    "dist/index.mjs",
    "dist/bin/api-lock.json",
    "dist/bin/cli.cjs",
    "package.json",
  ]) assert(files.has(expected), `missing npm artifact: ${expected}`);
  for (const forbidden of [
    "pontx-spec.json", "source.provenance.json", "pnpm-lock.yaml", "reports/unit-tests.json",
  ]) assert(!files.has(forbidden), `unexpected npm artifact: ${forbidden}`);

  const tarball = resolve(temporary, packed.filename);
  const installDirectory = join(temporary, "fresh-install");
  await writeFile(join(temporary, "package.json"), "{\"private\":true}\n");
  await execFileAsync("npm", ["install", "--no-package-lock", tarball], {
    cwd: temporary,
    maxBuffer: 10 * 1024 * 1024,
  });
  const installedPackage = JSON.parse(await readFile(
    join(temporary, "node_modules/@pontx/pinhere/package.json"), "utf8",
  ));
  assert.equal(installedPackage.name, "@pontx/pinhere");
  assert.equal(installedPackage.version, "0.1.0");

  await execFileAsync(process.execPath, ["--input-type=module", "--eval", [
    "import('@pontx/pinhere').then((sdk) => {",
    "if (typeof sdk.createPinhereClient !== 'function') process.exit(1);",
    "if (!sdk.default || !sdk.default.issues) process.exit(2);",
    "});",
  ].join("")], { cwd: temporary });
  const cli = join(temporary, "node_modules/.bin/pontx-pinhere");
  const { stdout: help } = await execFileAsync(cli, ["--help"], { cwd: temporary });
  assert.match(help, /pontx-pinhere/);
  console.log(`Package gate passed: ${packed.filename} fresh-installed with ESM and CLI smoke tests.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
