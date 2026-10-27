# Module tests

## Purpose

Native-sim fixtures for unicode input and Node regression tests for record evidence and CHG phase lifecycle validation.

## Ownership

`tests/<case>/native_sim.keymap` fixtures, their snapshots and patterns, and `records-evidence.test.mjs`.

## Local Contracts

A `native_sim.keymap` file is behavior evidence for the reusable ZMK test workflow. `records-evidence.test.mjs` checks evidence-path acceptance/rejection and CHG phase lifecycle validation. It does not flash a keyboard or execute Zephyr.

Phase regressions count only status cells in numbered, four-cell rows of the unfenced canonical phase table. An active `in-progress` CHG may have zero `in-progress` rows only with at least one `done (<evidence>)` row and one `pending` row. Reject no-started/all-pending, all-done active, and multiple-in-progress states; fenced examples, unrelated tables, malformed rows, phase names, and gate text must not supply phase statuses.

## Work Guidance

Add a fixture beside the existing cases when a driver change needs a new input sequence. Do not replace a native-sim fixture with a Node test.

## Verification

Run `node scripts/check-product-records.mjs` for repository records and `node --test tests/records-evidence.test.mjs` for evidence-path and phase-lifecycle regressions. The firmware workflow remains `.github/workflows/test-main.yml`.

## Child DOX Index

None.
