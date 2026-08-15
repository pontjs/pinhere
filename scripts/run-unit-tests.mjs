import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";

const reportsDirectory = resolve("reports");
const reportPath = resolve(reportsDirectory, "unit-tests.json");
await rm(reportPath, { force: true });
await mkdir(reportsDirectory, { recursive: true });

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(command, [
  "exec", "vitest", "run", "test/unit", "--reporter=json", `--outputFile=${reportPath}`,
], { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status ?? 1);

const report = JSON.parse(await readFile(reportPath, "utf8"));
const total = report.numTotalTests ?? 0;
const passed = report.numPassedTests ?? 0;
const failed = report.numFailedTests ?? 0;
const pending = report.numPendingTests ?? 0;
if (total === 0 || failed !== 0 || pending !== 0 || passed !== total) {
  throw new Error(
    `Unit-test gate failed: ${passed}/${total} passed, ${failed} failed, ${pending} skipped/todo`,
  );
}
console.log(`Unit-test gate passed: ${passed}/${total} passed (100.00%), 0 skipped/todo`);
