# Workflows

## Purpose

GitHub Actions for this module.

## Ownership

`workflows/test-main.yml`, `workflows/test-release.yml`, `workflows/release.yml`, `workflows/upgrade-zmk.yml`, and `workflows/records.yml`.

## Local Contracts

`test-main.yml` calls `urob/zmk-actions` `run-tests.yml` at `e89b7f5bd1226bc6cf9d20c12e649dc44b0a24a2` with `zmk-version: main`. That is the firmware behavior gate. `records.yml` runs the Node record check and the evidence-matcher test. Neither workflow flashes a user keyboard or edits `west.yml`.

## Work Guidance

Do not point the firmware workflow at a ZMK fork to make Studio accept `&uc`. Metadata belongs in the unicode driver.

## Verification

Record-check workflow steps must match the commands in root `AGENTS.md`. Firmware workflow success is observed from the GitHub run, not from the Node script.

## Child DOX Index

None.
