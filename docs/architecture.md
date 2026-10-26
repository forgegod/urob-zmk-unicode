# Architecture

## Purpose

`zmk-unicode` is a Zephyr module that compiles the `&uc` behavior into a ZMK firmware image. Keyboard configuration repositories import it through `west.yml`. A keymap includes `behaviors/unicode.dtsi` and binds `&uc` with two parameters.

## What this module owns

- `src/behaviors/behavior_unicode.c` — press handling for code points and input-mode switches.
- `include/dt-bindings/zmk-unicode/uc.h` — `UC_NONE` (`0x00`), `UC_SELECT_INPUT_MODE` (`0xffffff`), and mode indexes 0 through 5.
- `include/zmk-unicode/` — convenience aliases such as `UC_DE_AE` and `UC_SET_LINUX`.
- `dts/` — the `zmk,behavior-unicode` binding and devicetree include.
- `tests/` — native-sim fixtures for the existing input sequences.
- `tools/` — helpers that generate alias headers. They are not the runtime driver.

`CMakeLists.txt` adds the driver only when the build is not split or the split role is central.

## What it does not own

- ZMK's Studio RPC, protobuf, and `zmk_behavior_validate_binding`. Those already ask the behavior driver for parameter metadata. This module answers for `&uc`.
- ZMK Studio's React and Tauri client. A browser keymap editor may speak the same RPC without embedding that UI.
- A user's `west.yml` pin, build, or flash. Metadata in this tree does nothing until a config repo pins the revision and the central half is flashed.
- A `.keymap` file save. Studio `saveChanges` writes keyboard settings, which override the flashed keymap until `resetSettings`.

## Current driver boundary

`behavior_unicode_driver_api` sets `binding_pressed` and `binding_released`. It does not set `parameter_metadata` or `get_parameter_metadata`. A Studio client that writes `&uc` is therefore rejected by firmware validation. That absence is current behavior, not a shipped USB editor.

Code-point entry and mode switching still work from a compiled keymap. The native-sim fixtures cover those sequences. This initialization did not run the Zephyr workflow.

## Verification

```bash
node scripts/check-product-records.mjs
node --test tests/records-evidence.test.mjs
```

Firmware behavior remains `.github/workflows/test-main.yml`.
