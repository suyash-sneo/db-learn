# AGENTS.md

Guidance for any AI agent (or human) working on this repository. Read this first.

## What this repo is

A **self-contained, mobile-first learning curriculum** that teaches database internals well
enough for the owner to build their own database from scratch. The curriculum *is* the product:
a static HTML/CSS/JS site, read on a phone, deployed via GitHub Pages.

It teaches **toward** (but deliberately does **not** build) a schemaless, MongoDB-like,
single-file, embedded database written in **Rust**, exposing a **C ABI**, with **Flutter/Dart
FFI** as the first consumer. SQLite (storage track) and Isar (document track) are the teachers.

The full brief that generated this site is in [`docs/original-prompt.md`](docs/original-prompt.md).

## The non-negotiable rules (do not violate)

1. **No solution code for database components.** `build.html` pages may contain only: spec,
   milestones, acceptance criteria, a *failing* test suite, and `todo!()` stubs. **Never** a
   working implementation of the pager, B-tree, freelist, WAL, document layer, query evaluator,
   or C-ABI logic. If someone could paste a page and get a working component, the page is wrong.
   *Allowed:* Rust syntax examples on toy functions, `Cargo.toml`, test scaffolding, stubs, and
   short illustrative snippets from reference codebases in source-dive lessons (SQLite freely;
   Isar with attribution).
2. **No copyrighted text.** Teach ideas in original words; cite where to read/watch. Never
   reproduce book prose or transcribe lectures.
3. **Anti-hallucination.** Every precise factual claim (byte offsets, header sizes, default page
   sizes, exact algorithm steps, lock-state names, source-file/function claims, lecture
   timestamps) carries an inline `<span class="src">[src: …]</span>` pointer. Anything
   reconstructed from memory wears a `<span class="verify-tag">⚠️VERIFY</span>` tag and is listed
   in `verification.html`. Prefer pointing at the authoritative page over asserting an unsure
   number. Fetch a URL before citing it as confirmed.
4. **Beginner calibration** for both Rust and DB internals. Define terms on first use; favor
   intuition and diagrams over jargon.
5. **Phases are an ordering, not a schedule.** No day/week estimates anywhere.

## How the site is built (architecture)

- **Zero external/CDN dependencies.** Everything is local so it works fully offline. System font
  stack — no web fonts. All CSS/JS/SVG inline or in `assets/`.
- **`assets/style.css`** — design tokens for dark (default) + light themes, callout boxes, code
  blocks, diagram (`.dg-*`) classes that are theme-aware, the reading-progress bar, nav drawer.
- **`assets/app.js`** — the single source of truth for navigation. The `PHASES` array lists every
  phase/lesson with a `status` of `"done"` or `"soon"`. On load it builds the top bar, nav
  drawer, prev/next pager, progress bar, and theme toggle (persisted in `localStorage`, honoring
  `prefers-color-scheme` initially).
- **Each page** sets `window.PAGE = { id, root }` *before* loading `app.js`. `id` is
  `"<phase>:<lesson>"` (e.g. `"p2:2.3"`, or `"p2:build"`, or `"p2"` for a phase index) and must
  match an entry in `PHASES`. `root` is the relative path back to the site root (`""` at root,
  `"../../"` for lesson pages two levels deep).
- **Diagrams** are inline `<svg>` using the `.dg-*` CSS classes so they recolor with the theme.
  Do not embed raster images or hard-coded hex colors in SVGs.

### Page anatomy

- **Lesson page:** (1) title + one-line goal (`.goal`); (2) "why it matters to my DB"; (3) the
  full teaching with inline SVG diagrams (the bulk); (4) 3–6 concept checks in `<details>`;
  (5) a "Go deeper / verify" box (`.box.deeper`) citing book chapter + lecture + doc URL + source
  file; (6) a "Rust just-in-time" box (`.box.rust`) linking the Rust Book.
- **Build page:** deliverable spec, ordered milestones, acceptance criteria, a failing test suite,
  `todo!()` stubs, a graduated **Stuck?** hint ladder (nudge → bigger nudge → name-the-technique,
  never the solution), and a Definition-of-Done checklist. Opens with the "AI off" rule.

### Callout box classes (in `style.css`)

`deeper` (Go deeper/verify), `verify` (⚠️VERIFY), `stuck` (Stuck? hints), `check` (concept check),
`source` (source dive), `rust` (Rust just-in-time), `warn` (gotchas).

## Repository layout

```
/                      site root (GitHub Pages serves from here)
  index.html           landing: what this is, how to use it, architecture SVG, lesson map
  outline.html         full curriculum as a clickable map (rendered from PHASES)
  sources.html         annotated bibliography (✅ = fetched/confirmed, ⚠️VERIFY = unconfirmed)
  glossary.html        plain-language terms with a live filter; grows as phases are written
  verification.html    ChatGPT-review workflow + the ⚠️VERIFY index
  assets/style.css
  assets/app.js        the PHASES manifest + all page behavior
  phases/00-rust-warmup/      index.html, 01-*.html … 09-*.html, build.html
  phases/01-ffi-spike/        index.html, 01-*.html … 10-*.html, build.html
  phases/02-pager/ … 08-c-abi-aggregation/   (authored after design sign-off)
  docs/original-prompt.md     the verbatim generating brief
  .nojekyll                   tells GitHub Pages to serve files as-is (no Jekyll)
  AGENTS.md                   this file
```

## Status (as of last update)

- ✅ **Shared infra** — style.css, app.js, index, outline, sources, glossary, verification.
- ✅ **Phase 0 — Just-enough Rust** — index + 9 lessons + build (file-backed KV store).
- ✅ **Phase 1 — FFI spike** — index + 10 lessons + build (byte-buffer echo Rust→C ABI→Dart).
- ⏳ **Phases 2–8** — listed in `PHASES` as `"soon"`; appear in the drawer/outline; **awaiting the
  owner's sign-off on design + teaching depth before authoring** (per step 3 of the brief).

## Workflow for adding a phase (2–8)

1. Author `phases/NN-name/index.html` + every lesson from the outline + `build.html`, following
   the page anatomy above. Don't drop or merge outline items without noting why on the page.
2. Flip that phase's lessons from `"soon"` to `"done"` in the `PHASES` array in `assets/app.js`.
   Make sure each new page's `window.PAGE.id` matches its `PHASES` entry exactly.
3. Add any new terms to `glossary.html`.
4. Append every new `⚠️VERIFY` claim to the index table in `verification.html` (location + claim
   + where to check).
5. Source-dive lessons must point at exact files/functions and tag precise code claims `⚠️VERIFY`.

## Verifying changes locally

No build step. Open `index.html` in a browser (or `python3 -m http.server` from the root and
visit `http://localhost:8000`). Sanity checks: every page references `assets/app.js`, every
lesson's `window.PAGE.id` exists in `PHASES`, and inline `<svg>`/`<pre>`/`<details>` tags balance.

## Deployment

GitHub Pages serves the repo root of the default branch. `.nojekyll` is present so files are
served verbatim. Live site: <https://suyash-sneo.github.io/db-learn/>.

## Content-authoring standard learned from the Phase 0–1 review

This section records mistakes found during the June 20, 2026 accuracy review. Apply these rules
when authoring Phases 2–8 so later review does not have to reconstruct or correct the curriculum.

### A lesson must be self-contained, with sources as evidence

- Teach the complete concept, assumptions, mechanics, trade-offs, and consequences in the lesson.
  Do not outsource essential understanding to a book, lecture, documentation page, or source file.
- A learner should be able to answer every concept check using the lesson itself. "Read this external
  chapter first" is not acceptable as the main explanation.
- Source links support factual claims and offer optional depth. They are not substitutes for teaching.
- Explain the reason behind a rule. For example, do not merely say "sync the file"; distinguish
  process persistence, OS caching, filesystem guarantees, directory metadata, and crash protocols.
- Keep examples internally consistent across lessons, build pages, tests, headers, and Dart code.
  One concept must not use incompatible APIs in different pages.

### Source precise claims while writing, not after

- Open the authoritative source before writing a precise claim. Do not add a citation from memory.
- Prefer primary sources: official specifications/docs, upstream repositories, language references,
  and source code at a pinned revision. Use secondary sources only for orientation.
- Put the inline `<span class="src">[src: …]</span>` immediately beside the claim it supports.
  A bibliography entry alone does not source a lesson.
- A source must support the exact wording, including preconditions and limitations. Do not turn
  "attempts to synchronize" into "guaranteed on physical disk," or a useful mechanism into a
  guarantee it does not provide.
- For repository internals, cite the exact version or commit plus file/function. Never blend Isar
  v3, Isar v4, a community fork, LMDB, or libmdbx into one architecture description.
- For fast-moving APIs and tools, pin the version used by the exercise. Avoid claims based on a
  floating "latest" version.
- `⚠️VERIFY` is temporary, not decorative. Every real unresolved tag must have one exact row in
  `verification.html`: location, exact claim, and authoritative place to settle it. Do not create
  broad rows such as "verify Phase 4."

### Distinguish guarantees from conventions and design choices

- Avoid universal language such as "always," "never," "safe," "guaranteed," "zero cost," or
  "for free" unless the cited source proves it under clearly stated conditions.
- Separate:
  - language guarantees from common implementation behavior;
  - an ABI convention from an API design chosen by this project;
  - clean-restart persistence from atomicity and crash durability;
  - memory safety from logical database consistency;
  - a null check from full pointer validity;
  - a mechanism such as copy-on-write from a complete MVCC or crash-recovery protocol.
- State platform assumptions. C ABIs, symbol display, dynamic-library names, linking, `fsync`
  behavior, and Flutter packaging differ by target.
- State ownership and lifetime rules at the point where a pointer or buffer is introduced:
  readability/writability, valid length, lifetime, allocator/deallocator, aliasing, and threading.

### Rust and FFI baseline for this curriculum

- Use Rust edition 2024 in new examples and packages.
- Exported unmangled symbols use `#[unsafe(no_mangle)]`, with globally unique prefixed names.
- `extern "C"` selects the target's C calling convention; it does not make arbitrary Rust types
  ABI-safe. Keep `String`, `Vec`, references with unprovable borrow requirements, generics, and
  native-layout structs out of public C signatures.
- Prefer raw pointers at foreign boundaries and document their safety contracts. Checking for null
  cannot detect dangling, misaligned, undersized, read-only, or incorrectly aliased memory.
- `slice::from_raw_parts` requires a non-null aligned pointer even for length zero. If the ABI permits
  `(NULL, 0)`, branch first and map it to `&[]`; reject `(NULL, nonzero)`.
- For Rust-owned output buffers in this curriculum, prefer pointer + length backed by
  `Box<[u8]>`. Convert with `Vec::into_boxed_slice`/`Box::into_raw`; reclaim the unchanged pair with
  `ptr::slice_from_raw_parts_mut`/`Box::from_raw`. Represent empty output as `(NULL, 0)`.
  Do not expose a `Vec` capacity in one lesson and omit it in another.
- The API that allocates memory must provide the matching deallocation API. Do not claim that Rust
  and Dart/C necessarily use different allocators; the correct claim is that sharing an underlying
  allocator is not a stable deallocation contract.
- A live opaque handle in Phase 1 is not concurrently or reentrantly usable when boundary code creates
  `&mut Db`. Later concurrency support must introduce a deliberate synchronization/interior-mutability
  design rather than silently aliasing mutable references.
- Current panic behavior matters:
  - if an unwinding Rust panic reaches non-unwinding `extern "C"`, Rust aborts the process;
  - `extern "C-unwind"` permits unwinding;
  - a foreign exception entering a non-unwind Rust ABI is undefined behavior;
  - `catch_unwind` catches only unwinding Rust panics, not `panic = "abort"` or arbitrary crashes.
- Catching a panic does not prove a database handle remains logically valid. Publish state only after
  successful work, use transactional mutation, or poison the handle after a caught panic.
- cbindgen's CLI defaults to C++ output. Use `--lang c` or `language = "C"`, pin the tool, inspect
  generated output, and compile a C smoke test. cbindgen transcribes declarations; it does not prove
  ownership, pointer, threading, or panic safety.
- `package:ffigen` generates Dart bindings from a C header; `dart:ffi` is the runtime interop API.
  Match native Dart typedefs to the generated C header exactly. C `size_t` maps to Dart FFI `Size`.
- Flutter native-library loading is platform/package-layout specific. Do not teach one
  `DynamicLibrary` expression as universal for desktop, Android, and Apple platforms.
- In Dart, copy a Rust-owned native view into a Dart-owned `Uint8List` before calling the Rust free
  function. Put Rust-output cleanup and Dart-allocation cleanup in `finally` blocks.

### Database-content accuracy rules

- A successful `write`, `write_all`, or whole-file rewrite is not a crash-safe commit.
- Describe `File::sync_all()` as an operating-system synchronization request, with guarantees
  depending on OS, filesystem, device, hardware, and protocol. File creation/rename may require
  synchronizing the containing directory.
- Copy-on-write can support snapshots, MVCC, and crash-safe publication, but provides none of them
  automatically. Explain root publication, write ordering, synchronization, and reclamation.
- Do not state exact page sizes, byte offsets, header lengths, lock-state names, frame layouts,
  checkpoint thresholds, or algorithm steps without an inline primary source.
- Separate the design taught by this curriculum from SQLite's exact implementation. SQLite is a
  teacher, not proof that the new engine automatically inherits SQLite's properties.
- Separate Isar versions and dependencies. Confirm whether a claim describes v3, v4, a fork, or an
  underlying engine before teaching it.

### Build-page quality rules

- Build pages still must not contain working database-component solutions. Complete FFI plumbing
  examples belong in lessons; build pages contain signatures, contracts, `todo!()` stubs, failing
  tests, and graduated hints.
- Every acceptance criterion must be exercised by a test or explicitly labeled as a manual/external
  check. Do not claim "six tests" while providing five, or require forced-panic behavior without a
  test hook.
- Test both sides of boundary cases: empty input, nonempty input, null with zero length, null with
  nonzero length, null out-parameters, maximum/wrapping values where relevant, repeated lifecycle,
  and caught panic behavior.
- A loop that allocates and frees memory does not itself prove "no leaks." It is a lifecycle stress
  test. Require an external leak-aware tool or sanitizer for the leak claim.
- Test code must compile in the location the page instructs. `use super::*` works in an inline unit
  test module, not unchanged in an integration-test file.
- Error enums and hints must type-check together. If a hint uses `serde_json::to_vec(...)?`, the stub
  must supply a compatible `From<serde_json::Error>` conversion or instruct the learner to map it.
- Keep hint ladders graduated. The final hint may name the technique and relevant APIs, but must not
  become a pasteable implementation of a prohibited database component.

### Required validation before marking a phase done

1. Re-read every page as a beginner and confirm all required understanding is present locally.
2. Search the new phase for precise numbers, defaults, platform claims, "always/never/guaranteed,"
   source symbols, and fast-moving API statements; source or soften each one.
3. Compile representative Rust snippets that depend on unsafe contracts or current edition syntax.
   Documentation-looking code is not assumed to compile.
4. Check that every acceptance criterion has a real test or named manual verification method.
5. Check every local link, balanced HTML tag, SVG/pre/details structure, `window.PAGE.id`, and
   `PHASES` entry.
6. Keep `"soon"` lessons non-clickable until their files exist. Prev/next navigation must only include
   authored (`"done"`) pages.
7. Update `glossary.html`, `sources.html`, and `verification.html` in the same change as the lessons.
8. Run `git diff --check`, parse `assets/app.js`, and inspect the site in both light and dark themes
   at a narrow phone viewport before deployment.
