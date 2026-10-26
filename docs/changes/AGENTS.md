# Change records

## Purpose

Progress records for material module changes.

## Ownership

`README.md`, `active/`, `archive/`, and optional `reviews/CHG-<number>/` packages.

## Local Contracts

One active CHG owns each material request. Planned phases stay pending until a phase is explicitly reserved. Only verified work becomes done. Review packages stay out of product capability links.

## Work Guidance

Read `README.md` and `../product/README.md` before adding a record. Do not start a phase from a planning commit. The firmware workflow, not the record script, proves behavior changes.

## Verification

Run `node scripts/check-product-records.mjs` and the phase gate named in the CHG.

## Child DOX Index

None.
