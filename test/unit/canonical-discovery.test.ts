import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { expect, test } from "vitest";
import {
  canonicalJsonBytes,
  verifyCanonicalDiscovery,
} from "../../scripts/lib/canonical-discovery.mjs";

const sourceBytes = await readFile(resolve("pontx-spec.json"));
const canonicalBytes = canonicalJsonBytes(sourceBytes);
const canonicalHash = createHash("sha256").update(canonicalBytes).digest("hex");

test("verifies a canonical discovery response against the pinned source contract", async () => {
  await expect(verifyCanonicalDiscovery({
    url: "https://pinhere.dev/.well-known/pontx.json",
    sourceBytes,
    expectedCanonicalJsonSha256: canonicalHash,
    fetchImpl: async () => new Response(canonicalBytes, {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    }),
  })).resolves.toMatchObject({ sha256: canonicalHash, bytes: canonicalBytes.length });
});

test("rejects a discovery response with noncanonical bytes", async () => {
  await expect(verifyCanonicalDiscovery({
    url: "https://pinhere.dev/.well-known/pontx.json",
    sourceBytes,
    expectedCanonicalJsonSha256: canonicalHash,
    fetchImpl: async () => new Response("{}", {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  })).rejects.toThrow("canonical discovery bytes do not match");
});
