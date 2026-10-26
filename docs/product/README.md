# Product capability records

`capabilities/CAP-*.md` describes current module behavior. An active CHG describes progress. Neither replaces `../architecture.md`.

## When a CAP changes

Update a CAP when a caller-visible driver or binding contract changes. Do not update it for a comment-only edit.

A claim must be specific enough for a native-sim fixture, or a later test, to falsify.

## CAP shape

```markdown
# CAP-001 — Capability name

**Status:** implemented
**Primary surface:** none

## Behaviour

- <present-tense outcome>

## Implementation

- `src/behaviors/behavior_unicode.c` — <where>

## Verification

- `tests/shifted/native_sim.keymap` — <what the fixture exercises>

## Related contracts

- [Architecture](../../architecture.md)
```

Allowed status values: `implemented`, `partial`, `retired`.

`Primary surface` is `none` for this module. There is no wireframe directory. Adding `human`, or creating `wireframes/`, activates the canonical visual workflow and is not authorized by the current driver.

## Verification

Run `node scripts/check-product-records.mjs`. It checks structure and evidence paths. It does not run `.github/workflows/test-main.yml`.
