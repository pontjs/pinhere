import assert from "node:assert/strict";
import { createHash } from "node:crypto";

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function canonicalJsonBytes(bytes) {
  return Buffer.from(JSON.stringify(JSON.parse(Buffer.from(bytes).toString("utf8"))), "utf8");
}

export async function verifyCanonicalDiscovery({
  url,
  sourceBytes,
  expectedCanonicalJsonSha256,
  fetchImpl = fetch,
}) {
  const source = JSON.parse(Buffer.from(sourceBytes).toString("utf8"));
  const expected = canonicalJsonBytes(sourceBytes);
  assert.equal(
    sha256(expected),
    expectedCanonicalJsonSha256,
    "Release blocked: pinned canonical JSON hash does not match the source contract.",
  );

  let response;
  try {
    response = await fetchImpl(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    throw new Error(`Release blocked: canonical discovery fetch failed (${error.message}).`);
  }
  assert(response.ok,
    `Release blocked: canonical discovery returned HTTP ${response.status}.`);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json(?:;|$)/i,
    "Release blocked: canonical discovery must return application/json.");

  const actual = Buffer.from(await response.arrayBuffer());
  assert.equal(
    sha256(actual),
    expectedCanonicalJsonSha256,
    "Release blocked: canonical discovery bytes do not match the pinned canonical JSON contract.",
  );
  let parsed;
  try {
    parsed = JSON.parse(actual.toString("utf8"));
  } catch (error) {
    throw new Error(`Release blocked: canonical discovery is not valid JSON (${error.message}).`);
  }
  assert.deepEqual(parsed, source,
    "Release blocked: canonical discovery JSON differs from the pinned source contract.");

  return { sha256: sha256(actual), bytes: actual.length };
}
