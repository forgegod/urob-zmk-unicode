# Change records

A `CHG-*.md` file is the progress record for one material request. It does not describe current behavior. CAP records do.

## Lifecycle

```text
planned → in-progress → blocked → done
                    ↘ cancelled
```

`planned`, `in-progress`, and `blocked` records live in `active/`. `done` and `cancelled` records move to `archive/`.

## Required metadata

Every CHG names its `CHG-<number>` identity, the external request, affected CAP IDs, the baseline commit, and phases with a status and an executable gate.

Use `pending`, `in-progress`, and `done (<evidence>)` for phase rows. Keep one phase in progress at a time.

## CHG shape

```markdown
# CHG-001 — Change name

**Status:** planned
**External request:** <ticket URL or direct operator request>
**Impacts:** CAP-001
**Baseline:** `<commit>`

| # | Phase | Status | Verification gate |
| --- | --- | --- | --- |
| 1 | Specify the driver change | pending | `node scripts/check-product-records.mjs` exits 0 |
| 2 | Implement the driver change | pending | `.github/workflows/test-main.yml` succeeds |
| 3 | Integrate the current record | pending | `node scripts/check-product-records.mjs` exits 0 |

## Phase 1 — Specify the driver change

**Goal:** <observable target>

1. <exact steps>

**Verification gate:** <executable predicate>

## Out of scope

- <excluded work>
```

## Current records

| Change | Status |
| --- | --- |
| [CHG-001 — Advertise unicode parameter metadata](active/CHG-001-advertise-unicode-parameter-metadata.md) | planned |

## Archive

No archived change records.

## Review packages

Keep proposal notes in `reviews/CHG-<number>/` with a `README.md` that says `**Status:** review-only`. Do not create an empty package. This module has no product wireframes.

## Verification

Run `node scripts/check-product-records.mjs` after editing a record. Firmware phases still require `.github/workflows/test-main.yml`.
