# CAP-001 — Unicode behavior

**Status:** implemented
**Primary surface:** none

## Behaviour

- A keymap can bind `&uc` with two parameters. A normal press emits `param1`, or `param2` when Shift is active and `param2` is not `0`.
- `param1` of `0xffffff` selects the input mode in `param2` instead of emitting a code point. Mode indexes are `0` through `5`, from macOS through Emacs.
- The driver is compiled only for a non-split image or the central split role.
- The driver does not advertise Studio parameter metadata. A Studio RPC write of `&uc` is not accepted by this revision.

## Implementation

- `src/behaviors/behavior_unicode.c` — press, release, and driver API.
- `include/dt-bindings/zmk-unicode/uc.h` — sentinel, empty shifted value, and mode indexes.
- `CMakeLists.txt` — central-only compilation.

## Rules and boundaries

- Code points are sent as if the host is using a US keyboard layout. This module does not detect or switch the host layout.
- `0` in the shifted slot means no shifted code point. It is not a separate Studio metadata type in this revision.
- [ADR-0001](../../design-decisions.md) keeps future Studio acceptance on this driver rather than in a ZMK fork. That metadata is not implemented at this baseline.

## Verification

- `tests/shifted/native_sim.keymap` — shifted and unshifted code-point press fixture. The Zephyr workflow that executes the `tests/` fixtures was not run during blueprint initialization.
- `tests/switch-input/native_sim.keymap` — input-mode switch fixture, under the same unridden workflow limit.

## Related contracts

- [Architecture](../../architecture.md)
