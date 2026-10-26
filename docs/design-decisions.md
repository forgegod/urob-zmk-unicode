# Design decisions

This index records durable forks. `docs/architecture.md` is the live contract.

## ADR-0001: Studio acceptance lives on the unicode driver

**Status:** Accepted

### Context

ZMK validates a Studio binding by asking the behavior driver for parameter metadata. The `&uc` driver is in this module, not in `zmkfirmware/zmk`. Forking ZMK to special-case unicode would have to be rebased on every firmware upgrade and would still diverge when this module updates the driver.

### Decision

Advertise `&uc` parameters from `behavior_unicode.c` in this module. Leave the Studio RPC and protobuf unchanged. A browser client may consume the existing RPC; it is not part of this repository.

### Consequences

A keyboard accepts USB `&uc` writes only after its `west.yml` pin moves to a revision that contains the metadata and the central image is flashed. Until that revision, clients must treat missing metadata as refusal. An upstream pull request to `urob/zmk-unicode` is optional and is not required for this fork to build.
