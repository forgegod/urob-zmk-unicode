# CAP-001 — Unicode behavior

**Status:** implemented
**Primary surface:** none

## Behaviour

- A keymap can bind `&uc` with two parameters. A normal press emits `param1`, or `param2` when Shift is active and `param2` is not `0`.
- `param1` of `0xffffff` selects the input mode in `param2` instead of emitting a code point. Mode indexes are `0` through `5`, from macOS through Emacs.
- The driver is compiled only for a non-split image or the central split role.
- With `CONFIG_ZMK_BEHAVIOR_METADATA` enabled, `&uc` advertises two alternative parameter sets through `behavior_unicode_driver_api.parameter_metadata` for ZMK's existing Studio binding validation:
  - Code-point set: `param1` and `param2` each accept `0` through `0x10FFFF`.
  - Mode-switch set: `param1` is fixed at `UC_SELECT_INPUT_MODE` (`0xffffff`), and `param2` accepts mode indexes `0` through `5`.
- A binding matching either complete set satisfies the driver's parameter metadata contract; code-point and mode-switch parameter domains are not mixed.

## Implementation

- `src/behaviors/behavior_unicode.c` — press, release, and driver API with configuration-guarded parameter metadata.
- `include/dt-bindings/zmk-unicode/uc.h` — sentinel, empty shifted value, and mode indexes.
- `CMakeLists.txt` — central-only compilation.

## Rules and boundaries

- Code points are sent as if the host is using a US keyboard layout. This module does not detect or switch the host layout.
- `0` in the shifted slot means no shifted code point. It is not a separate Studio metadata type in this revision.
- The code-point metadata range includes surrogate values; it does not add Unicode scalar validation or change runtime press and release behavior.
- [ADR-0001](../../design-decisions.md) keeps Studio binding acceptance on this driver's metadata rather than in a ZMK fork. A keyboard needs firmware containing this revision with metadata enabled; this module does not update a keyboard's pin, flash firmware, or implement the browser client.

## Verification

- `tests/shifted/native_sim.keymap` — Shift selection for a code-point press using `tests/behavior_keymap.dtsi`.
- `tests/switch-input/native_sim.keymap` — input-mode switch followed by an unshifted code-point press.
- CHG-001 phase 2 records a successful `.github/workflows/test-main.yml` run: [40647822265](https://github.com/forgegod/urob-zmk-unicode/actions/runs/40647822265), at revision `08af43a5aa4838319046c1f2aa0d6efdf6c975d1`.
- The fixtures cover runtime input sequences, not end-to-end Studio RPC writes. `tests/records-evidence.test.mjs` checks record evidence and phase lifecycle rules, not firmware behavior.

## Related contracts

- [Architecture](../../architecture.md)
