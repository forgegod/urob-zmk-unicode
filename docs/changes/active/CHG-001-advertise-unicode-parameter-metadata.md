# CHG-001 — Advertise unicode parameter metadata

**Status:** planned
**External request:** Direct operator request: adopt the AI Software Blueprint to this unicode fork and define the change record required so Studio RPC can accept `&uc` writes. Forks and upstream pull requests are allowed; put the change in the repository that owns the contract.
**Impacts:** CAP-001
**Baseline:** `6ce21267e497e20ff9e05da16d4eefcdd3e89190`

The browser client that sends these writes is `forgegod/katafoxi-keymap-editor-extended` CHG-020. This record does not implement that client.

| # | Phase | Status | Verification gate |
| --- | --- | --- | --- |
| 1 | Specify the two parameter sets | pending | `node scripts/check-product-records.mjs` exits 0 |
| 2 | Advertise metadata from the unicode driver | pending | `.github/workflows/test-main.yml` succeeds and `behavior_unicode_driver_api` sets parameter metadata |
| 3 | Integrate the current capability record | pending | `node scripts/check-product-records.mjs && node --test tests/records-evidence.test.mjs` exits 0 |

## Phase 1 — Specify the two parameter sets

**Goal:** the driver contract names the sets a Studio client must see before it can write `&uc`, without changing runtime press behavior.

1. Code-point set: two parameters, each accepting `0` through `0x10FFFF`. `0` remains the existing unshifted-only shortcut, not a new sentinel.
2. Mode-switch set: first parameter fixed at `0xffffff` (`UC_SELECT_INPUT_MODE`); second parameter one of mode indexes `0` through `5` from `include/dt-bindings/zmk-unicode/uc.h`.
3. Do not accept surrogate code points as a new keymap feature. The current driver does not reject them; a stricter range is in scope only if the existing native-sim fixtures still pass.
4. Record the sets in this phase section. Do not claim CAP-001 already advertises them.

**Verification gate:** `node scripts/check-product-records.mjs` exits 0.

## Phase 2 — Advertise metadata from the unicode driver

**Goal:** `behavior_unicode_driver_api` answers ZMK's existing metadata query so `zmk_behavior_validate_binding` can accept a matching `&uc` binding.

1. Set `.parameter_metadata` or `.get_parameter_metadata` in `src/behaviors/behavior_unicode.c`. Use ZMK's existing metadata types. Do not add an RPC, protobuf field, or ZMK core special case.
2. Keep press and release behavior unchanged for compiled keymap bindings, including Shift selection and `UC_NONE`.
3. Leave `behavior_mask_mods.c` unchanged.
4. The behavior gate is the existing firmware workflow, not the Node record script. A phase row may not be marked done from a source inspection alone.

**Verification gate:** `.github/workflows/test-main.yml` succeeds, and `behavior_unicode_driver_api` sets parameter metadata.

## Phase 3 — Integrate the current capability record

**Goal:** CAP-001 states that this revision advertises the two sets, and only after phase 2's workflow evidence exists.

1. Amend CAP-001 in present tense. Remove the sentence that says this revision does not advertise metadata.
2. Keep the central-only compile rule and the US-layout host limit.
3. Archive this CHG only in this phase, after the record check and the evidence-matcher test pass. Do not open an upstream pull request from the archive step.

**Verification gate:** `node scripts/check-product-records.mjs && node --test tests/records-evidence.test.mjs` exits 0.

## Out of scope

- Patching `zmkfirmware/zmk` or forking ZMK Studio.
- The browser Web Serial client and alias expansion. Those belong to the keymap editor.
- Changing a keyboard config `west.yml`, building a Sofle image, or flashing either half. The pin belongs to `forgegod/keebart-zmk-config` CHG-001 and waits for this metadata revision.
- An upstream pull request to `urob/zmk-unicode`. That remains an operator choice after this fork's phase 2 passes.
- Runtime settings for the default input mode. Compile-time `default-mode` stays a devicetree property.
