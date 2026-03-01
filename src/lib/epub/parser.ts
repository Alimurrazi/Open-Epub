import Epub, { Book } from "epubjs";
import { NavItem } from "epubjs/types/navigation";
import { BookMeta, Chapter } from "@/types/book";

export async function parseEpub(
  file: File
): Promise<{ book: Book; meta: BookMeta; chapters: Chapter[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const book = Epub(arrayBuffer);

  await book.ready;

  const metadata = await book.loaded.metadata;
  const nav = await book.loaded.navigation;

  const title = metadata.title || file.name.replace(/\.epub$/i, "");
  const author = metadata.creator || "Unknown Author";
  const language = metadata.language || "en";

  // Flatten nav TOC into a lookup map keyed by href (anchor stripped)
  const navByHref = new Map<string, NavItem>();
  const flattenNav = (items: NavItem[]) => {
    for (const item of items) {
      navByHref.set(item.href.split("#")[0], item);
      if (item.subitems?.length) flattenNav(item.subitems);
    }
  };
  flattenNav(nav.toc);

  const chapters: Chapter[] = [];

  book.spine.each((section: { idref: string; href: string; index: number }) => {
    const navItem = navByHref.get(section.href);
    chapters.push({
      id: section.idref,
      href: section.href,
      title: navItem ? navItem.label.trim() : `Chapter ${section.index + 1}`,
      index: section.index,
    });
  });

  const meta: BookMeta = {
    id: crypto.randomUUID(),
    title,
    author,
    language,
    totalChapters: chapters.length,
    addedAt: Date.now(),
  };

  return { book, meta, chapters };
}
