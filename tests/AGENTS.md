# Module tests

## Purpose

Native-sim fixtures for unicode input and the Node check that record evidence names those fixtures.

## Ownership

`tests/<case>/native_sim.keymap` fixtures, their snapshots and patterns, and `records-evidence.test.mjs`.

## Local Contracts

A `native_sim.keymap` file is behavior evidence for the reusable ZMK test workflow. `records-evidence.test.mjs` proves only that the record validator accepts that fixture path. It does not flash a keyboard or execute Zephyr.

## Work Guidance

Add a fixture beside the existing cases when a driver change needs a new input sequence. Do not replace a native-sim fixture with a Node test.

## Verification

`node --test tests/records-evidence.test.mjs` checks the evidence matcher. The firmware workflow remains `.github/workflows/test-main.yml`.

## Child DOX Index

None.
