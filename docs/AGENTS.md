# Documentation

## Purpose

Architecture, durable decisions, current module behavior, and change progress.

## Ownership

`architecture.md`, `design-decisions.md`, `product/`, and `changes/`.

## Local Contracts

CAPs describe behavior this revision implements. Active CHGs are the only progress authority. Planned metadata is not a shipped Studio capability.

This module has no primary human-facing surface and no `docs/product/wireframes/` directory.

## Work Guidance

Read the product and change contracts before creating records. Do not copy keymap secrets or a user's `west.yml` into these docs.

## Verification

Run `node scripts/check-product-records.mjs` after a record change. That check does not run the Zephyr workflow.

## Child DOX Index

| Child | Owns |
| --- | --- |
| `product/AGENTS.md` | Current capability records. |
| `changes/AGENTS.md` | Planned work and phase progress. |
