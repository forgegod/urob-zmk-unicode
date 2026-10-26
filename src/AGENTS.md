# Behavior drivers

## Purpose

Runtime behavior compiled into a ZMK image.

## Ownership

`behaviors/behavior_unicode.c` and `behaviors/behavior_mask_mods.c`.

## Local Contracts

`CMakeLists.txt` compiles these sources only when the build is not split or the role is central. The unicode driver currently exposes `binding_pressed` and `binding_released` and does not advertise parameter metadata. Mode selection is `param1 == 0xffffff` with `param2` as the mode index. A code-point press uses `param2` when Shift is active and `param2` is not `UC_NONE` (`0`); otherwise it uses `param1`.

Do not move this driver into a ZMK fork to satisfy Studio validation.

## Work Guidance

Keep keymap aliases in `include/`. A metadata change must preserve the existing code-point and mode-switch behavior covered by `tests/`.

## Verification

Firmware behavior is exercised by `.github/workflows/test-main.yml`. This directory has no separate local test command.

## Child DOX Index

None.
