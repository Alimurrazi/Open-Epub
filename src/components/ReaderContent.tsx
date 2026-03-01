"use client";

import { useState, useRef } from "react";
import type { Book } from "epubjs";
import type { BookMeta, Chapter } from "@/types/book";
import useEpubUpload from "@/hooks/useEpubUpload";
import useReader from "@/hooks/useReader";
import TableOfContents from "@/components/TableOfContents";

export default function ReaderContent() {
  const [book, setBook] = useState<Book | null>(null);
  const [meta, setMeta] = useState<BookMeta | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadEpub, uploading, error } = useEpubUpload();
  const { goToChapter, goNext, goPrev } = useReader(containerRef, book);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadEpub(file);
    if (result) {
      setBook(result.book);
      setMeta(result.meta);
      setChapters(result.chapters);
      setCurrentIndex(0);
    }
  }

  function handleChapterSelect(href: string, index: number) {
    setCurrentIndex(index);
    goToChapter(href);
  }

  function handleBackToLibrary() {
    setBook(null);
    setMeta(null);
    setChapters([]);
    setCurrentIndex(0);
  }

  // Upload screen
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-6xl">📖</span>
          <h1 className="text-3xl font-bold text-gray-900">OpenEPUB Reader</h1>
          <p className="text-gray-500">Open any EPUB file to start reading</p>

          {uploading ? (
            <p className="text-gray-500 text-sm">Parsing book…</p>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-[#7c5cbf] text-white rounded-lg text-sm font-medium hover:bg-[#6a4daa] transition-colors"
            >
              Open EPUB File
            </button>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            ref={fileInputRef}
            type="file"
            accept=".epub"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  }

  // Reader layout
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] h-full flex flex-col bg-gray-50 border-r border-gray-200 shrink-0">
        <div className="px-4 py-4 shrink-0">
          <p className="font-bold text-gray-900 truncate">{meta?.title}</p>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{meta?.author}</p>
        </div>
        <div className="border-t border-gray-200 shrink-0" />
        <div className="flex-1 overflow-hidden">
          <TableOfContents
            chapters={chapters}
            currentIndex={currentIndex}
            onSelect={handleChapterSelect}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-12 shrink-0 flex items-center justify-between px-4 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={handleBackToLibrary}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← Library
          </button>
          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
            {chapters[currentIndex]?.title}
          </span>
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              className="text-sm px-3 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            >
              Prev
            </button>
            <button
              onClick={goNext}
              className="text-sm px-3 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        </header>

        {/* Reader canvas */}
        <div className="flex-1 overflow-hidden bg-white">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
