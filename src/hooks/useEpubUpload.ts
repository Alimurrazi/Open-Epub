"use client";

import { useState } from "react";
import { Book } from "epubjs";
import { parseEpub } from "@/lib/epub/parser";
import { BookMeta, Chapter } from "@/types/book";

type UploadResult = { book: Book; meta: BookMeta; chapters: Chapter[] };

export default function useEpubUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadEpub(file: File): Promise<UploadResult | null> {
    if (!file.name.endsWith(".epub")) {
      setError("Please select a valid .epub file");
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await parseEpub(file);
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
