export interface BookMeta {
  id: string;
  title: string;
  author: string;
  language: string;
  totalChapters: number;
  addedAt: number;
}

export interface Chapter {
  id: string;
  href: string;
  title: string;
  index: number;
}

export interface ReadingProgress {
  bookId: string;
  chapterIndex: number;
  cfi: string;
}
