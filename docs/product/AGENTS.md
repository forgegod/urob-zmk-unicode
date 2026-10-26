# Product capability records

## Purpose

Current behavior of this Zephyr module.

## Ownership

`README.md`, `index.md`, and `capabilities/`.

## Local Contracts

A CAP states present behavior and cites an existing implementation file plus a `tests/<case>/native_sim.keymap` fixture. Do not claim a workflow run that did not happen. This module has no human surface, so no CAP declares `human` and no wireframe directory exists.

## Work Guidance

Update a CAP only when observable module behavior changes. Studio parameter metadata is not current behavior until its CHG phase is verified.

## Verification

Run `node scripts/check-product-records.mjs`.

## Child DOX Index

None. Parent contract: `../AGENTS.md`.
