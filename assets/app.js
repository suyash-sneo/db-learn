/* =========================================================================
   DB-Internals Curriculum — shared behavior
   - theme toggle (localStorage + prefers-color-scheme)
   - nav drawer (built from the manifest below)
   - prev/next links
   - reading progress bar
   No external dependencies. Each page sets window.PAGE = {id, root}.
   ========================================================================= */

/* ---- Curriculum manifest (single source of truth for nav) ------------- */
/* status: "done" = authored, "soon" = not yet written.
   url is relative to site root (PAGE.root is prepended). */
const PHASES = [
  { id: "p0", num: "0", title: "Just-enough Rust + re-anchor", dir: "phases/00-rust-warmup",
    lessons: [
      ["0.1", "Why I'm building this & how to use it", "01-why.html", "done"],
      ["0.2", "Rust + Cargo setup & running tests",    "02-cargo.html", "done"],
      ["0.3", "Ownership, borrowing, moves",            "03-ownership.html", "done"],
      ["0.4", "Structs, enums, pattern matching",       "04-structs-enums.html", "done"],
      ["0.5", "Error handling: Result, Option, ?",      "05-errors.html", "done"],
      ["0.6", "Traits & generics (just enough)",        "06-traits-generics.html", "done"],
      ["0.7", "Collections & byte buffers",             "07-collections.html", "done"],
      ["0.8", "Files & I/O: Read/Write/Seek",           "08-files-io.html", "done"],
      ["0.9", "Serialization with serde",               "09-serde.html", "done"],
      ["build", "Build: a file-backed key-value store", "build.html", "done"],
    ] },
  { id: "p1", num: "1", title: "FFI spike — de-risk the scary part", dir: "phases/01-ffi-spike",
    lessons: [
      ["1.1", "What a C ABI is; ABI vs API",            "01-c-abi.html", "done"],
      ["1.2", "extern \"C\", no_mangle, repr(C)",       "02-extern-c.html", "done"],
      ["1.3", "Passing primitives & pointers",          "03-primitives-pointers.html", "done"],
      ["1.4", "The opaque-handle pattern",              "04-opaque-handle.html", "done"],
      ["1.5", "Byte buffers & memory ownership",        "05-byte-buffers.html", "done"],
      ["1.6", "Panics across FFI = UB",                 "06-panics.html", "done"],
      ["1.7", "Errors: codes + out-params",             "07-error-codes.html", "done"],
      ["1.8", "Generating the header with cbindgen",    "08-cbindgen.html", "done"],
      ["1.9", "dart:ffi basics",                        "09-dart-ffi.html", "done"],
      ["1.10","flutter_rust_bridge (conceptual)",       "10-frb.html", "done"],
      ["build", "Build: byte-buffer echo across the boundary", "build.html", "done"],
    ] },
  { id: "p2", num: "2", title: "The single file & the pager", dir: "phases/02-pager",
    lessons: [
      ["2.1","Why fixed-size pages","01-pages.html","soon"],
      ["2.2","The file header","02-file-header.html","soon"],
      ["2.3","Page numbers ↔ offsets","03-page-offsets.html","soon"],
      ["2.4","Reading/writing pages; the VFS","04-vfs.html","soon"],
      ["2.5","The page cache / buffer pool","05-buffer-pool.html","soon"],
      ["2.6","Flushing, fsync, the durability gap","06-fsync.html","soon"],
      ["2.7","Source dive: SQLite pager.c","07-source-pager.html","soon"],
      ["build","Build: a Rust pager","build.html","soon"],
    ] },
  { id: "p3", num: "3", title: "The index: B+tree", dir: "phases/03-btree",
    lessons: [
      ["3.1","Why an ordered, disk-oriented index","01-why-btree.html","soon"],
      ["3.2","B-tree vs B+tree; internal vs leaf","02-bplus.html","soon"],
      ["3.3","Node layout inside a page","03-node-layout.html","soon"],
      ["3.4","Search / traversal","04-search.html","soon"],
      ["3.5","Insert & node splits","05-insert-split.html","soon"],
      ["3.6","Delete, merge, rebalance","06-delete.html","soon"],
      ["3.7","B-tree vs LSM revisited","07-lsm.html","soon"],
      ["3.8","Source dive: SQLite btree.c","08-source-btree.html","soon"],
      ["3.9","Source dive: LMDB/MDBX copy-on-write","09-source-lmdb.html","soon"],
      ["build","Build: a persistent B+tree","build.html","soon"],
    ] },
  { id: "p4", num: "4", title: "Records & free space", dir: "phases/04-records-freespace",
    lessons: [
      ["4.1","Fixed vs variable-length records","01-records.html","soon"],
      ["4.2","Slotted pages","02-slotted-pages.html","soon"],
      ["4.3","Cell formats & overflow pages","03-overflow.html","soon"],
      ["4.4","Deleting; fragmentation & compaction","04-compaction.html","soon"],
      ["4.5","The freelist","05-freelist.html","soon"],
      ["4.6","Source dive: SQLite record/cell + freelist","06-source-records.html","soon"],
      ["build","Build: slotted pages + freelist","build.html","soon"],
    ] },
  { id: "p5", num: "5", title: "Durability: journal, WAL, recovery", dir: "phases/05-durability-wal",
    lessons: [
      ["5.1","ACID at the storage layer","01-acid.html","soon"],
      ["5.2","The crash model","02-crash-model.html","soon"],
      ["5.3","Rollback journal","03-rollback-journal.html","soon"],
      ["5.4","Write-ahead logging","04-wal.html","soon"],
      ["5.5","Checkpointing","05-checkpoint.html","soon"],
      ["5.6","Recovery on open","06-recovery.html","soon"],
      ["5.7","Transactions at the engine level","07-transactions.html","soon"],
      ["5.8","Source dive: SQLite wal.c","08-source-wal.html","soon"],
      ["build","Build: WAL + recovery + crash test","build.html","soon"],
    ] },
  { id: "p6", num: "6", title: "The document layer", dir: "phases/06-document-layer",
    lessons: [
      ["6.1","From records to documents","01-documents.html","soon"],
      ["6.2","BSON vs MessagePack vs JSON","02-serialization.html","soon"],
      ["6.3","Storing documents","03-storing.html","soon"],
      ["6.4","CRUD on the engine","04-crud.html","soon"],
      ["6.5","Secondary indexes on fields","05-secondary-indexes.html","soon"],
      ["6.6","The query model & evaluator","06-query-model.html","soon"],
      ["6.7","Query planning basics","07-planning.html","soon"],
      ["6.8","Source dive: Isar","08-source-isar.html","soon"],
      ["6.9","MongoDB data model & CRUD","09-mongodb.html","soon"],
      ["build","Build: collections + CRUD + index + filter","build.html","soon"],
    ] },
  { id: "p7", num: "7", title: "Concurrency", dir: "phases/07-concurrency",
    lessons: [
      ["7.1","The concurrency problem","01-problem.html","soon"],
      ["7.2","File locking & SQLite lock states","02-locking.html","soon"],
      ["7.3","Isolation & MVCC overview","03-mvcc.html","soon"],
      ["7.4","Rust concurrency for this","04-rust-concurrency.html","soon"],
      ["7.5","Flutter isolates across FFI","05-isolates.html","soon"],
      ["7.6","Source dive: SQLite locking","06-source-locking.html","soon"],
      ["build","Build: the locking layer","build.html","soon"],
    ] },
  { id: "p8", num: "8", title: "Real C ABI + aggregation", dir: "phases/08-c-abi-aggregation",
    lessons: [
      ["8.1","Designing a stable public C API","01-public-api.html","soon"],
      ["8.2","The full API with byte buffers","02-full-api.html","soon"],
      ["8.3","Cursors / iteration across FFI","03-cursors.html","soon"],
      ["8.4","Error reporting, versioning, ABI stability","04-versioning.html","soon"],
      ["8.5","cbindgen header + Dart binding","05-binding.html","soon"],
      ["8.6","Aggregation (v2): the pipeline","06-aggregation.html","soon"],
      ["8.7","Packaging for iOS/Android","07-packaging.html","soon"],
      ["build","Build: the real C ABI + Dart binding","build.html","soon"],
    ] },
];

/* flat list for prev/next */
const FLAT = [];
PHASES.forEach(p => p.lessons.forEach(l =>
  FLAT.push({ pid: p.id, phaseNum: p.num, num: l[0], title: l[1],
              url: p.dir + "/" + l[2], status: l[3] })));

/* ---- Theme ------------------------------------------------------------ */
(function initTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) document.documentElement.setAttribute("data-theme", stored);
  else {
    const prefersLight = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.setAttribute("data-theme", prefersLight ? "light" : "dark");
  }
})();
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  const btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = next === "light" ? "🌙" : "☀️";
}

/* ---- Build chrome (topbar + drawer + scrim) --------------------------- */
function buildChrome() {
  const root = (window.PAGE && window.PAGE.root) || "";
  const curId = window.PAGE && window.PAGE.id;
  const theme = document.documentElement.getAttribute("data-theme");

  // progress bar
  const prog = document.createElement("div");
  prog.id = "progress";
  document.body.prepend(prog);

  // topbar
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML =
    '<button class="iconbtn" id="menuBtn" aria-label="Open menu">☰</button>' +
    '<a class="brand" href="' + root + 'index.html">DB<span class="dot">·</span>Internals Curriculum</a>' +
    '<button class="iconbtn" id="themeBtn" aria-label="Toggle theme">' +
      (theme === "light" ? "🌙" : "☀️") + '</button>';
  document.body.prepend(bar);

  // scrim + drawer
  const scrim = document.createElement("div");
  scrim.id = "scrim";
  const drawer = document.createElement("nav");
  drawer.id = "drawer";

  let html = '<div class="drawer-head">Curriculum map</div>';
  PHASES.forEach(p => {
    html += '<div class="phase">';
    html += '<a class="phase-link" href="' + root + p.dir + '/index.html">' +
            'Phase ' + p.num + ' — ' + p.title + '</a><ul>';
    p.lessons.forEach(l => {
      const lid = p.id + ":" + l[0];
      const cls = (lid === curId) ? ' class="current"' : '';
      const tag = l[3] === "soon" ? ' <span class="muted">·soon</span>' : '';
      html += '<li><a' + cls + ' href="' + root + p.dir + '/' + l[2] + '">' +
              (l[0] === "build" ? "▸ Build" : l[0]) + ' — ' + l[1] + tag + '</a></li>';
    });
    html += '</ul></div>';
  });
  html += '<div class="drawer-foot">' +
    '<a href="' + root + 'index.html">Home</a>' +
    '<a href="' + root + 'outline.html">Outline</a>' +
    '<a href="' + root + 'sources.html">Sources</a>' +
    '<a href="' + root + 'glossary.html">Glossary</a>' +
    '<a href="' + root + 'verification.html">⚠️ Verify</a></div>';
  drawer.innerHTML = html;

  document.body.append(scrim, drawer);

  const open = () => { drawer.classList.add("open"); scrim.classList.add("open"); };
  const close = () => { drawer.classList.remove("open"); scrim.classList.remove("open"); };
  document.getElementById("menuBtn").onclick = open;
  scrim.onclick = close;
  document.getElementById("themeBtn").onclick = toggleTheme;
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  // scroll current lesson into view inside drawer
  const cur = drawer.querySelector("a.current");
  if (cur) cur.scrollIntoView({ block: "center" });
}

/* ---- Prev / Next ------------------------------------------------------ */
function buildPager() {
  const curId = window.PAGE && window.PAGE.id;
  if (!curId) return;
  const root = (window.PAGE && window.PAGE.root) || "";
  const idx = FLAT.findIndex(f => (f.pid + ":" + f.num) === curId);
  if (idx === -1) return;
  const mount = document.getElementById("pager");
  if (!mount) return;
  const prev = FLAT[idx - 1], next = FLAT[idx + 1];
  const cell = (item, dir) => {
    if (!item) return '<a class="' + dir + ' disabled"><span class="dir">' +
      (dir === "prev" ? "Start" : "End") + '</span></a>';
    return '<a class="' + dir + '" href="' + root + item.url + '">' +
      '<span class="dir">' + (dir === "prev" ? "← Prev" : "Next →") + '</span>' +
      '<span class="ttl">' + (item.num === "build" ? "Build" : item.num) + ' · ' + item.title + '</span></a>';
  };
  mount.innerHTML = cell(prev, "prev") + cell(next, "next");
}

/* ---- Reading progress ------------------------------------------------- */
function initProgress() {
  const bar = document.getElementById("progress");
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  buildChrome();
  buildPager();
  initProgress();
});
