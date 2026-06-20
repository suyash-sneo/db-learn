# Original Prompt

> This is the verbatim brief that this curriculum was generated from. Preserved here for provenance
> and for the ChatGPT review pass referenced in `verification.html`.

---

# Claude Code Prompt — Build My Database-Internals Curriculum as a Mobile HTML Site

> Paste everything below this line into Claude Code, in a fresh empty directory.

---

## Your role

You are **authoring a complete, self-contained learning curriculum** that teaches database internals well enough for me to build my own database from scratch. The curriculum is the product: I read it on my phone, around the clock, as my primary way of learning. **Write the actual teaching content** — full explanations, worked examples, diagrams — so each page stands on its own. I should learn the concept *from your page alone*, without the book or a video open.

This is a large job and that's expected. Be thorough; teach, don't summarize.

You are NOT (1) writing my database implementation (Hard Rule 1) or (2) reproducing copyrighted text (Hard Rule 2). Everything you need is in this prompt; don't ask me for background.

---

## About me (calibrate to this)

- Experienced mobile/Flutter dev. I know how to *use* SQLite and the DB basics, but **little to nothing** about internals (storage format, paging, freelists, B-trees, WAL, concurrency, recovery). Teach from there.
- I know **very little Rust**. Assume beginner; teach Rust features the first time they appear.
- Time is fragmented/scarce → content must be **phone-readable** and split into self-contained lessons of ~10–20 min each.
- I over-relied on AI to write code and it wrecked my focus. This project is the cure: **I write every line of the database myself.** Build pages must enforce that.

---

## What the curriculum teaches toward (context — do NOT build it)

A schemaless, MongoDB-like, **serverless single-file embedded database** in **Rust**, exposing a **C ABI** (usable from any language) with **Flutter/Dart FFI** as the first consumer. CRUD primary, aggregation secondary. Decisions already made — teach toward them:

- **From-scratch storage engine in Rust** (not a layer over SQLite).
- **B+tree** core index (not LSM) — fits the single-file goal; SQLite is the teacher. Mention LSM as a valid v2.
- **Three layers:** (1) pure idiomatic-Rust core engine; (2) thin C ABI shim (opaque handle pointers, integer error codes + out-params, `catch_unwind` so panics never cross the boundary, `cbindgen` header); (3) language bindings, Dart FFI first.
- **Documents cross the FFI boundary as serialized byte buffers** (BSON or MessagePack); the C surface stays tiny.
- SQLite studied on two tracks: file-format/WAL/locking → the *engine*; C-interface/architecture → *C-ABI design*.

---

## Content sourcing — teach from these, in your own words

The curriculum's coverage and ordering follow these sources so nothing important is missed. You **write original lessons** teaching the same concepts — never copying prose or transcribing video. Each lesson ends with a **"Go deeper / verify"** box citing exactly where the same material lives.

**Conceptual backbone**
- **Database Internals**, Alex Petrov (O'Reilly 2019). Cite chapters; don't reproduce.
- **CMU 15-445/645 Intro to Database Systems**, Andy Pavlo (free, YouTube). Cite lecture titles; timestamps tagged `⚠️VERIFY`.
- **Designing Data-Intensive Applications**, Kleppmann — ch.3 for B-tree vs LSM.

**Authoritative engine specs + REAL SOURCE CODE (a first-class part of this curriculum)**
- **SQLite** — docs *and* source. **SQLite source is public domain**, so you may show real illustrative snippets. Architecture overview: `sqlite.org/arch.html`. Docs: file format `fileformat2.html`, WAL `wal.html`, atomic commit `atomiccommit.html`, locking `lockingv3.html`, C-interface reference, and the header `sqlite3.h`. Key source files to send me into (the "lower / storage track"): `pager.c` (pager), `wal.c` (WAL), `btree.c` + `btreeInt.h` (B-tree), `os_unix.c` (VFS/OS layer), `build.c`, `main.c`, and the amalgamation `sqlite3.c`.
- **Isar** (`github.com/isar/isar`) — a real Rust embedded NoSQL DB for Flutter; the **"upper / document track"** reference: schema, collections, indexes, query engine, and the Rust↔Dart FFI boundary. Start from the architecture wiki at `deepwiki.com/isar/isar` (Core Architecture / Cross-Platform / Development sections) `⚠️VERIFY`, then the repo source. Note: Isar v3's core was built **on top of LMDB/libmdbx** (an embedded B-tree KV store) rather than a from-scratch engine; v4 reworked the core — `⚠️VERIFY` current state. Isar is **Apache-2.0**: explain and cite, short attributed snippets only, no wholesale copying. Official development has slowed; a community fork exists — `⚠️VERIFY`.
- **LMDB / libmdbx** — secondary reference for the embedded KV engine and **MVCC copy-on-write** design that Isar sits on.

**FFI / C-ABI track**
- **Rustonomicon (FFI chapter)**, **cbindgen** docs, **dart:ffi** docs, **flutter_rust_bridge** docs.

**Document-model track**
- **MongoDB** data-model & CRUD conceptual docs.

**Rust**
- **The Rust Book** + **Rustlings** (just-in-time).
- **cstack "Let's Build a Simple Database"** (`cstack.github.io/db_tutorial`) — hands-on pager/B-tree companion, **in C and incomplete**; adapt to Rust.

Treat all of the above as the **coverage blueprint and the source of truth my later ChatGPT review checks against** — not text to reproduce.

### "Source dive" lessons
Several phases include a **source dive** lesson (see outline). In each, explain — in your own words — how the real codebase is structured, what each key file/function is responsible for, and how it maps to what I'm building. Point me at exact files (and functions where you can name them). Short illustrative snippets are fine from SQLite (public domain) and, with attribution, from Isar (Apache-2.0). Tag any precise claim about the code with `⚠️VERIFY` so my review pass checks it against the actual repo.

---

## OUTPUT FORMAT — a beautiful, mobile-first HTML/CSS site

Not markdown. A static site of linked HTML pages with shared CSS/JS that I open on my phone.

**Design**
- **Mobile-first**, responsive. Content column ~680px max on wider screens; comfortable on a phone.
- **Dark theme by default** (around-the-clock reading) + a light/dark **toggle** persisted in `localStorage`; honor `prefers-color-scheme` initially.
- **Reading-optimized typography**: ~17–18px body, line-height ~1.65, generous spacing, sane line length. **System font stack** so it works **offline, no web-font downloads**.
- **No external/CDN dependencies** — fully offline. All CSS/JS/SVG local. (Use your frontend-design skill for tasteful, non-generic styling; avoid a default-template look.)
- Polished: styled code blocks (mono, high contrast, horizontal-scroll on mobile); callout boxes (Go-deeper, ⚠️VERIFY, Stuck?, Concept-check, Source-dive); thin top **reading-progress bar**; large tap targets.
- **Inline SVG diagrams** for anything spatial — page layout, slotted pages, B-tree node splits, WAL flow, the three-layer architecture, the FFI boundary.

**Navigation**
- Landing `index.html`: what this is, how to use it, the architecture overview, and the full linked lesson map.
- Persistent menu/drawer to jump between phases and lessons.
- **Prev / Next** at the bottom of every lesson.
- `<details>`/`<summary>` for collapsible concept-check answers and graduated "Stuck?" hints.

**Directory structure**
```
db-curriculum/
  index.html
  assets/{style.css, app.js}
  phases/
    00-rust-warmup/{index.html, 01-*.html … , build.html}
    01-ffi-spike/ …
    02-pager/ …
    03-btree/ …
    04-records-freespace/ …
    05-durability-wal/ …
    06-document-layer/ …
    07-concurrency/ …
    08-c-abi-aggregation/ …
  outline.html          # the full curriculum outline below, as a clickable map
  sources.html          # annotated bibliography (verified links)
  verification.html     # my ChatGPT-review workflow + auto-index of every ⚠️VERIFY claim
  glossary.html         # plain-language terms, grown as you write
```

**Each lesson page contains:** (1) title + one-line goal; (2) why it matters to my DB; (3) the full teaching, beginner-friendly, with inline SVG diagrams — the bulk of the page; (4) 3–6 concept checks with collapsible answers; (5) a Go-deeper/verify box (book chapter + lecture + timestamp `⚠️VERIFY` + doc URL + source file); (6) Rust just-in-time notes linked to the Rust Book.

**Each `build.html` contains:** deliverable spec + ordered milestones + acceptance criteria; a **failing test suite** and **`todo!()` signatures** to implement against; a graduated **"Stuck?"** hint ladder (nudge → bigger nudge → name-the-technique, never the solution); a Definition-of-Done checklist.

---

## CURRICULUM OUTLINE (authoritative — each numbered item = one lesson page; expand fully, don't drop or merge without noting why)

**Phase 0 — Just-enough Rust + re-anchor**
- 0.1 Why I'm building this & how to use this curriculum (AI as tutor, never author)
- 0.2 Rust + Cargo setup, project layout, running tests
- 0.3 Ownership, borrowing, moves, references
- 0.4 Structs, enums, pattern matching
- 0.5 Error handling: `Result`, `Option`, `?`, custom error types
- 0.6 Traits & generics (just enough)
- 0.7 Collections: `Vec`, `HashMap`, slices, and byte buffers (`&[u8]`, `Vec<u8>`)
- 0.8 Files & I/O: `std::fs`, `std::io`, `Read`/`Write`/`Seek`
- 0.9 Serialization with `serde` (JSON to start)
- **build** — by hand, AI off: a CLI key-value store persisted to a file (Rust litmus test + focus reset)

**Phase 1 — FFI spike (early, to de-risk the scariest unknown)**
- 1.1 What a C ABI is; ABI vs API; why Rust can expose one
- 1.2 `extern "C"`, `#[no_mangle]`, `repr(C)`
- 1.3 Passing primitives and pointers across the boundary
- 1.4 The opaque-handle pattern (`Box::into_raw` / `from_raw`)
- 1.5 Byte buffers across the boundary; memory ownership; the free function
- 1.6 Panics across FFI = UB; `catch_unwind` / `panic=abort`
- 1.7 Errors across a C ABI: integer codes + out-params
- 1.8 Generating the header with `cbindgen`
- 1.9 `dart:ffi` basics: `DynamicLibrary`, lookups, `Pointer`, `malloc`/`free`, `Uint8List`
- 1.10 `flutter_rust_bridge`: what it automates (conceptual)
- **build** — byte-buffer "echo" across Rust → C ABI → Dart in a real Flutter app

**Phase 2 — The single file & the pager**
- 2.1 Why fixed-size pages; the page as the unit of I/O
- 2.2 The file header: magic number, format/version fields
- 2.3 Page numbers ↔ file offsets
- 2.4 Reading/writing pages; the OS/VFS abstraction
- 2.5 The page cache / buffer pool: eviction, dirty pages, pinning
- 2.6 Flushing, `fsync`, and the durability gap (teaser for Phase 5)
- 2.7 **Source dive:** SQLite `pager.c` — what the pager owns
- **build** — a Rust pager (open, page read/write, cache, flush)

**Phase 3 — The index: B+tree (hardest phase)**
- 3.1 Why an ordered, disk-oriented index; B-tree vs binary tree vs hash
- 3.2 B-tree vs B+tree; internal vs leaf nodes
- 3.3 Node layout inside a page: keys, cells, child pointers
- 3.4 Search / traversal
- 3.5 Insert & node splits; tree growth; root splits
- 3.6 Delete, merge, rebalance (overview; full delete can come later)
- 3.7 B-tree vs LSM revisited — the fork, why B-tree for me, LSM as v2 (DDIA ch.3)
- 3.8 **Source dive:** SQLite `btree.c` / `btreeInt.h`
- 3.9 **Source dive:** how LMDB/MDBX (under Isar) does B-tree + copy-on-write
- **build** — a persistent B+tree on the pager (search, insert, split)

**Phase 4 — Records & free space**
- 4.1 Fixed vs variable-length records; why documents force variable-length
- 4.2 Slotted pages: slot array + record heap growing from both ends
- 4.3 Cell/record formats; overflow pages for large values
- 4.4 Deleting records; in-page fragmentation and compaction
- 4.5 The freelist: tracking, reusing free pages (SQLite freelist + trunk pages)
- 4.6 **Source dive:** SQLite record/cell format + freelist handling
- **build** — slotted-page layout for serialized document blobs + a freelist

**Phase 5 — Durability: journal, WAL, recovery, transactions**
- 5.1 ACID at the storage layer; what atomicity & durability really require
- 5.2 The crash model: torn writes, `fsync`, write ordering
- 5.3 Rollback journal (SQLite's original atomic-commit scheme)
- 5.4 Write-ahead logging: the idea, the WAL file, frames
- 5.5 Checkpointing: merging the WAL back into the main file
- 5.6 Recovery on open: replay / rollback
- 5.7 Transactions at the engine level: begin / commit / rollback
- 5.8 **Source dive:** SQLite `wal.c` + the atomic-commit doc
- **build** — a WAL + recovery routine; verify with a `kill -9` mid-write crash test

**Phase 6 — The document layer (where it becomes MY product)**
- 6.1 From KV/records to documents: collections, `_id`, the schemaless model
- 6.2 Serialization choice: BSON vs MessagePack vs raw JSON — tradeoffs
- 6.3 Storing documents: collection → records → pages
- 6.4 CRUD: insert / find-by-id / update / delete on the engine
- 6.5 Secondary indexes on document fields (reuse the B+tree); composite & multi-entry indexes (Isar-style)
- 6.6 The query model: a Mongo-like filter (`{field: {$gt: …}}`) and an evaluator
- 6.7 Query planning basics: index scan vs full scan; choosing an index
- 6.8 **Source dive:** Isar — schema, links/embedded objects, indexes, query engine in Rust
- 6.9 MongoDB data model & CRUD semantics (conceptual reference)
- **build** — collections + CRUD + a secondary index + a filter evaluator

**Phase 7 — Concurrency**
- 7.1 The concurrency problem; single-writer / multiple-reader
- 7.2 File locking; SQLite lock states; how WAL enables concurrent readers
- 7.3 Isolation & MVCC overview (MDBX/LMDB copy-on-write) — reference
- 7.4 Rust concurrency for this: `Send`/`Sync`, `Arc`, `Mutex`/`RwLock`
- 7.5 Flutter isolates hitting the DB; thread-safety across the FFI boundary
- 7.6 **Source dive:** SQLite locking (OS layer) + WAL reader/writer coordination
- **build** — the locking layer + safe concurrent access

**Phase 8 — Real C ABI surface + aggregation (secondary)**
- 8.1 Designing a stable public C API (lessons from `sqlite3.h`): lifecycle, handles, result codes, memory
- 8.2 The full API: open/close/insert/find/update/delete with byte-buffer marshalling
- 8.3 Cursors / iteration across FFI (returning many documents)
- 8.4 Error reporting, versioning, ABI stability
- 8.5 The `cbindgen` header + a polished Dart binding
- 8.6 Aggregation (v2): the pipeline concept — match / group / sort — and how to layer it
- 8.7 Packaging: building for iOS/Android, shipping the binary with the Flutter plugin
- **build** — the real C ABI + Dart binding; optional aggregation MVP

---

## Hard rules

1. **NO SOLUTION CODE for my database components.** Build pages may contain only: specs, milestones, acceptance criteria, failing tests, and `todo!()` stubs. Never working implementations of the pager, B-tree, freelist, WAL, document layer, query evaluator, or C-ABI logic. If I could paste your output and get a working component, you've failed. *Allowed:* Rust syntax examples teaching a feature on a toy function, `Cargo.toml`, test scaffolding, stubs, and short *illustrative* snippets from the reference codebases in source-dive lessons (SQLite freely; Isar with attribution).
2. **No copyrighted text.** Don't reproduce Petrov's prose or transcribe lectures. Teach the ideas originally; cite where to read/watch.
3. **Anti-hallucination (my ChatGPT review depends on it).** Every precise factual claim — byte offsets, header field sizes, default page sizes, exact algorithm steps, lock-state names, source-file/function claims, lecture timestamps — carries an inline source pointer like `[src: SQLite fileformat2.html §1.3]`. Anything reconstructed from memory gets a visible `⚠️VERIFY` tag. Prefer pointing me at the authoritative page/file over asserting a number you're unsure of. Verify a URL (fetch it) before citing; if you can't confirm it, say so rather than invent. `verification.html` must auto-collect every `⚠️VERIFY` location (file + section + claim).
4. **Beginner calibration** for both Rust and DB internals. Intuition and diagrams over jargon; define terms on first use.
5. **Phases are an ordering, not a schedule.** No day/week estimates.

---

## How to proceed

1. Build the directory; write `assets/style.css` + `assets/app.js` (dark-default theme + toggle + nav drawer + progress bar), the landing `index.html`, `outline.html` (the full outline above as a clickable map), `sources.html` (verified links), `glossary.html` (seeded), and `verification.html`.
2. **Fully author Phase 0 and Phase 1** — every lesson page in the outline plus their build pages — as finished HTML.
3. **Then STOP and show me the rendered structure + Phase 0 and Phase 1**, and ask me to confirm the **design and the teaching depth** before generating Phases 2–8.
4. After I confirm, author the remaining phases per the outline, keeping `glossary.html` and the `verification.html` ⚠️VERIFY index updated as you go.

Begin.
