# db-learn

A phone-readable curriculum that teaches **database internals** well enough to build your own
database from scratch — a schemaless, single-file, embedded database in **Rust** with a **C ABI**
and **Flutter/Dart FFI** as the first consumer. SQLite and Isar are the teachers; you write every
line of the engine yourself.

## 📖 Read it

**→ <https://suyash-sneo.github.io/db-learn/>**

Works fully offline once loaded — no fonts, no CDNs, dark theme by default with a light toggle.

## What's inside

- **Phase 0 — Just-enough Rust** (10 lessons + a build): ownership, errors, traits, byte buffers,
  files & I/O, serde, then a from-scratch file-backed key-value store.
- **Phase 1 — FFI spike** (11 lessons + a build): C ABI, opaque handles, byte buffers across the
  boundary, `catch_unwind`, cbindgen, dart:ffi — proving a byte buffer round-trips
  Rust → C ABI → Flutter.
- **Phases 2–8** — pager, B+tree, records/free space, durability (WAL), the document layer,
  concurrency, and the public C ABI. (Authored after design sign-off; visible in the outline.)

Every lesson teaches the concept in full and ends with a *Go deeper / verify* box. Every **build**
gives a spec, failing tests, and `todo!()` stubs — never a working implementation. AI is the tutor,
never the author.

## For contributors / agents

See [`AGENTS.md`](AGENTS.md) for the architecture, the hard rules, and the workflow for adding a
phase. The original generating brief is in [`docs/original-prompt.md`](docs/original-prompt.md).

## Local preview

No build step:

```sh
python3 -m http.server   # then open http://localhost:8000
```
