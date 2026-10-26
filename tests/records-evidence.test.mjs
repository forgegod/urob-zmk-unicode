import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";

const { validateRecords } = await import(
  pathToFileURL(path.resolve("scripts/check-product-records.mjs")).href
);

async function fixture(verificationRef) {
  const root = await mkdtemp(path.join(tmpdir(), "unicode-records-"));
  await mkdir(path.join(root, "docs/product/capabilities"), { recursive: true });
  await mkdir(path.join(root, "docs/changes/active"), { recursive: true });
  await mkdir(path.join(root, "docs/changes/archive"), { recursive: true });
  await mkdir(path.join(root, "src/behaviors"), { recursive: true });
  await mkdir(path.join(root, "tests/shifted"), { recursive: true });
  await writeFile(path.join(root, "docs/product/README.md"), "# Product\n");
  await writeFile(
    path.join(root, "docs/product/index.md"),
    "[CAP-001](capabilities/CAP-001-unicode-behavior.md)\n",
  );
  await writeFile(path.join(root, "docs/changes/README.md"), "# Changes\n");
  await writeFile(path.join(root, "src/behaviors/behavior_unicode.c"), "driver\n");
  await writeFile(path.join(root, "tests/shifted/native_sim.keymap"), "&uc 0xE4 0\n");
  await writeFile(
    path.join(root, "docs/product/capabilities/CAP-001-unicode-behavior.md"),
    `# CAP-001 — Unicode behavior

**Status:** implemented
**Primary surface:** none

## Behaviour

- The driver emits a code point.

## Implementation

- \`src/behaviors/behavior_unicode.c\`

## Verification

- \`${verificationRef}\`
`,
  );
  return root;
}

test("a native_sim keymap fixture counts as unicode behaviour evidence", async () => {
  const root = await fixture("tests/shifted/native_sim.keymap");
  try {
    const { errors } = await validateRecords(root);
    assert.deepEqual(
      errors.filter((error) => error.includes("behaviour test")),
      [],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("an unrelated fixture does not satisfy the behaviour-evidence rule", async () => {
  const root = await fixture("tests/shifted/events.patterns");
  try {
    const { errors } = await validateRecords(root);
    assert.ok(
      errors.some((error) =>
        error.includes("must reference at least one executable behaviour test"),
      ),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
