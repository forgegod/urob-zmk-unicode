# Record validation

## Purpose

Dependency-free checks for CAP and CHG structure.

## Ownership

`check-product-records.mjs`.

## Local Contracts

The script checks record shape, lifecycle placement, local links, and evidence paths. It accepts JavaScript `*.test.*` / `*.spec.*` files and `tests/<case>/native_sim.keymap` fixtures. It does not infer that a firmware test passed.

## Work Guidance

Extend an evidence rule with a fixture in `tests/records-evidence.test.mjs` that both accepts a real path and rejects an unrelated one.

## Verification

Run `node scripts/check-product-records.mjs` and `node --test tests/records-evidence.test.mjs`.

## Child DOX Index

None.
