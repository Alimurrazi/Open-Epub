"use client";

import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { Book } from "epubjs";
import { parseEpub } from "@/lib/epub/parser";
import { BookMeta, Chapter } from "@/types/book";

type UploadResult = { book: Book; meta: BookMeta; chapters: Chapter[] };

export default function useEpubUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadEpub(): Promise<UploadResult | null> {
    setError(null);

    const filePath = await open({
      multiple: false,
      filters: [{ name: "EPUB", extensions: ["epub"] }],
    });

    if (!filePath) return null;

    setUploading(true);

    try {
      const bytes = await readFile(filePath);
      const fileName = filePath.split(/[\\/]/).pop() ?? "book.epub";
      const result = await parseEpub(bytes.buffer as ArrayBuffer, fileName);
      setUploading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setUploading(false);
      return null;
    }
  }

  return { uploading, error, uploadEpub };
}
