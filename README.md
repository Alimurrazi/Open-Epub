# OpenEPUB — Desktop EPUB Reader

A desktop EPUB reader built with **Next.js + Tauri 2**, created as an implementation of [Coding Challenge #109 - Ebook Reader](https://codingchallenges.substack.com/p/coding-challenge-109-ebook-reader?r=gjveo&utm_campaign=post&utm_medium=web&triedRedirect=true).

> **Challenge Progress:** Step 1 complete — open and display an EPUB file.

---

## Stack

- **Frontend:** Next.js 16 (static export) + React 19 + Tailwind CSS 4
- **Desktop shell:** Tauri 2 (native file dialog, filesystem access, bundling)
- **EPUB engine:** epubjs 0.3.93
- **Language:** TypeScript 5 (strict mode)

---

## Features

- Open EPUB files via native file dialog (Tauri `plugin-dialog`)
- Parse EPUB metadata — title, author, language
- Render EPUB content in an embedded webview via epubjs
- Table of Contents sidebar with chapter navigation
- Previous / Next chapter buttons
- Two-panel layout: TOC sidebar + reader canvas

---

## Challenge Steps

| Step | Description | Status |
|------|-------------|--------|
| 1 | Open and display an EPUB file | Done |
| 2 | Table of contents navigation | Partially done (flat TOC, no nesting) |
| 3 | Bookmarks | Not started |
| 4 | Search | Not started |
| 5 | Settings (font size, theme) | Not started |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/) for your platform

### Install

```bash
npm install
```

### Run

```bash
# Next.js dev server only (browser, no native features)
npm run dev

# Full Tauri desktop app (recommended)
npm run tauri:dev
```

### Build

```bash
npm run tauri:build
```

> Note: Tauri-specific features (file dialog, filesystem) only work via `tauri:dev` / `tauri:build`. The plain `npm run dev` browser mode cannot open local files.

---

## Architecture

Next.js compiles to a static export (`out/`) which Tauri serves as a webview. No SSR — all components using browser APIs or epubjs are client-only.

```
src/
├── app/
│   └── reader/page.tsx       # Dynamic loader (SSR disabled)
├── components/
│   ├── ReaderContent.tsx     # Top-level state: book, chapters, navigation
│   └── TableOfContents.tsx   # Pure display component
├── hooks/
│   ├── useEpubUpload.ts      # File selection via Tauri dialog + epubjs parse
│   └── useReader.ts          # epubjs Rendition lifecycle
├── lib/epub/
│   ├── parser.ts             # Builds Chapter[] from epubjs Book (spine + nav)
│   └── renderer.ts           # Mounts/displays Rendition
└── types/
    └── book.ts               # BookMeta, Chapter, ReadingProgress
```

### Data flow

1. User clicks "Open File" → `useEpubUpload` calls Tauri `dialog.open()` + `fs.readFile()`
2. `parseEpub()` creates epubjs `Book`, extracts metadata and TOC
3. `ReaderContent` holds state: `book`, `meta`, `chapters[]`, `currentIndex`
4. `useReader` mounts epubjs `Rendition` into a `<div ref={containerRef}>`
5. Chapter navigation calls `goToChapter(href)` / `goNext()` / `goPrev()`

---

## Known Limitations

- Reading progress is not persisted (resets on app restart)
- TOC hierarchy is flattened — nested chapters display at the same level
- No font size, line height, or theme controls
- No text search
- No bookmarks
- CSP is currently disabled in `tauri.conf.json` — epubjs scripts from EPUB content run unrestricted

---

## License

MIT
