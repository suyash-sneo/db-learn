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
