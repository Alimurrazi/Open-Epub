# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Next.js dev server only (no Tauri window)
npm run dev

# Full Tauri dev (launches desktop window, also starts Next.js)
npm run tauri:dev

# Production build (Next.js static export + Tauri bundle)
npm run tauri:build

# Lint
npm run lint
```

There are no tests. The app must be run via `tauri:dev` to test Tauri-specific features (file dialogs, fs plugin).

## Architecture

This is a **Next.js + Tauri 2** desktop EPUB reader. Next.js compiles to a static export (`out/`) which Tauri serves as a webview.

**Key constraint:** Next.js runs as a static export (`output: "export"` in `next.config.ts`). No SSR. All components that use browser APIs or epubjs must be client-only. The reader page loads `ReaderContent` via `dynamic(..., { ssr: false })` for this reason.

### Data flow

1. User picks a file → `useEpubUpload` → `parseEpub()` reads `ArrayBuffer`, creates epubjs `Book`, extracts metadata + TOC
2. `ReaderContent` holds top-level state: `book`, `meta`, `chapters[]`, `currentIndex`
3. `useReader` mounts the epubjs `Rendition` into a `<div ref={containerRef}>` and exposes `goToChapter / goNext / goPrev`
4. `TableOfContents` is a pure display component; chapter navigation goes through `goToChapter(href)`

### Module responsibilities

| Path | Role |
|---|---|
| `src/lib/epub/parser.ts` | Creates epubjs `Book` from `File`, builds `Chapter[]` by merging spine order with nav TOC |
| `src/lib/epub/renderer.ts` | Thin wrapper: `mountBook` (creates `Rendition`) and `displayChapter` |
| `src/hooks/useReader.ts` | Manages `Rendition` lifecycle tied to `book` + `containerRef` |
| `src/hooks/useEpubUpload.ts` | Wraps `parseEpub` with loading/error state; currently uses browser `File` (pending migration to Tauri dialog) |
| `src/types/book.ts` | Shared types: `BookMeta`, `Chapter`, `ReadingProgress` |

### Tauri integration

- Tauri plugins configured: `tauri-plugin-dialog`, `tauri-plugin-fs`, `tauri-plugin-log`
- `useEpubUpload.ts` still uses a browser `<input type="file">` — the pending task is replacing this with `@tauri-apps/plugin-dialog` `open()` and `@tauri-apps/plugin-fs` to read the file as bytes
- When reading files via `tauri-plugin-fs`, the result is `Uint8Array`; pass directly to `Epub(uint8array.buffer)` in `parser.ts`
