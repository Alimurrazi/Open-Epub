"use client";

import { useEffect, useRef, useCallback } from "react";
import { Book, Rendition } from "epubjs";
import { mountBook, displayChapter } from "@/lib/epub/renderer";

export default function useReader(
  containerRef: React.RefObject<HTMLDivElement | null>,
  book: Book | null,
  onChapterChange?: (spineIndex: number) => void
) {
  const renditionRef = useRef<Rendition | null>(null);
  const onChapterChangeRef = useRef(onChapterChange);
  useEffect(() => {
    onChapterChangeRef.current = onChapterChange;
  });

  useEffect(() => {
    if (!book || !containerRef.current) return;

    const rendition = mountBook(book, containerRef.current);
    renditionRef.current = rendition;
    rendition.display();

    rendition.on("relocated", (location: { start: { index: number } }) => {
      onChapterChangeRef.current?.(location.start.index);
    });

    return () => {
      rendition.destroy();
      renditionRef.current = null;
    };
  }, [book, containerRef]);

  const goToChapter = useCallback((href: string) => {
    if (!renditionRef.current) return;
    displayChapter(renditionRef.current, href);
  }, []);

  const goNext = useCallback(() => {
    renditionRef.current?.next();
  }, []);

  const goPrev = useCallback(() => {
    renditionRef.current?.prev();
  }, []);

  return { goToChapter, goNext, goPrev };
}
