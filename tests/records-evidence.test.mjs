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

const phaseTableHeader = `| # | Phase | Status | Verification gate |
| --- | --- | --- | --- |`;
const doneRow = "| 1 | Complete the first phase | done (`node check.mjs` exit 0 @ 0123456789abcdef) | `node check.mjs` exits 0 |";
const pendingRow = "| 2 | Start the later phase | pending | `node check.mjs` exits 0 |";
const inProgressRow = "| 3 | Execute a phase | in-progress | `node check.mjs` exits 0 |";
const missingProgress = "must have exactly one in-progress phase";

const phaseCases = [
  {
    name: "an active change record may be between completed and pending phases",
    rows: [doneRow, pendingRow],
  },
  {
    name: "an active change record may have exactly one in-progress phase",
    rows: [inProgressRow, pendingRow],
  },
  {
    name: "an active change record rejects all-pending phases",
    rows: [pendingRow, pendingRow.replace("| 2 |", "| 3 |")],
    errors: [missingProgress],
  },
  {
    name: "an active change record rejects an empty phase table",
    rows: [],
    errors: [missingProgress],
  },
  {
    name: "an active change record rejects all-done phases",
    rows: [doneRow, doneRow.replace("| 1 |", "| 2 |")],
    errors: [missingProgress],
  },
  {
    name: "completed and pending phases do not excuse multiple in-progress phases",
    rows: [doneRow, pendingRow, inProgressRow, inProgressRow.replace("| 3 |", "| 4 |")],
    errors: [missingProgress, "has more than one in-progress phase"],
  },
  {
    name: "a fenced done example cannot make an all-pending change between phases",
    before: `\`\`\`markdown\n${phaseTableHeader}\n${doneRow}\n\`\`\`\n`,
    rows: [pendingRow],
    errors: [missingProgress],
  },
  {
    name: "a fenced pending example cannot make an all-done change between phases",
    rows: [doneRow],
    after: `~~~markdown\n${phaseTableHeader}\n${pendingRow}\n~~~\n`,
    errors: [missingProgress],
  },
  {
    name: "a fenced in-progress example cannot start a pending change",
    rows: [pendingRow],
    after: `\`\`\`markdown\n${phaseTableHeader}\n${inProgressRow}\n\`\`\`\n`,
    errors: [missingProgress],
  },
  {
    name: "fenced in-progress examples do not create multiple real in-progress phases",
    before: `~~~markdown\n${phaseTableHeader}\n${inProgressRow}\n~~~\n`,
    rows: [inProgressRow, pendingRow],
  },
  {
    name: "done in the gate column cannot make a pending change between phases",
    rows: ["| 1 | First phase | pending | done (example receipt) |", pendingRow],
    errors: [missingProgress],
  },
  {
    name: "pending in the gate column cannot make an all-done change between phases",
    rows: [doneRow.replace("`node check.mjs` exits 0", "pending")],
    errors: [missingProgress],
  },
  {
    name: "in-progress outside the status column cannot start a pending change",
    rows: ["| 1 | in-progress | pending | in-progress |"],
    errors: [missingProgress],
  },
  {
    name: "status words outside the status column do not invalidate between-phases state",
    rows: [doneRow.replace("Complete the first phase", "in-progress"), pendingRow.replace("`node check.mjs` exits 0", "in-progress")],
  },
  {
    name: "a five-cell row cannot supply a completed phase",
    rows: ["| 1 | First phase | done (example receipt) | gate | extra |", pendingRow],
    errors: [missingProgress],
  },
  {
    name: "rows in an unrelated table cannot supply a completed phase",
    rows: [pendingRow],
    after: `| # | Example | Status | Notes |\n| --- | --- | --- | --- |\n${doneRow}\n`,
    errors: [missingProgress],
  },
];

for (const { name, rows, before = "", after = "", errors: expectedErrors = [] } of phaseCases) {
  test(name, async () => {
    const root = await fixture("tests/shifted/native_sim.keymap");
    const changePath = "docs/changes/active/CHG-001-between-phases.md";
    try {
      await writeFile(
        path.join(root, changePath),
        `# CHG-001 — Between phases

**Status:** in-progress
**External request:** Direct operator request: verify the record lifecycle.
**Impacts:** CAP-001
**Baseline:** \`0123456789abcdef\`

${before}
${phaseTableHeader}
${rows.join("\n")}

${after}

## Phase 1 — Complete the first phase

**Goal:** prove a completed phase may precede pending work.

## Phase 2 — Start the later phase

**Goal:** preserve later work as pending.
`,
      );
      const { errors } = await validateRecords(root);
      assert.deepEqual(errors, expectedErrors.map((error) => `${changePath} ${error}`));
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}
