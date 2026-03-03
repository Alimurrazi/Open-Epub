import { Book, Rendition } from "epubjs";

export function mountBook(book: Book, containerEl: HTMLElement): Rendition {
  return book.renderTo(containerEl, {
    width: "100%",
    height: "100%",
    flow: "scrolled-doc",
    allowScriptedContent: true,
  });
}

export async function displayChapter(
  rendition: Rendition,
  href: string
): Promise<void> {
  await rendition.display(href);
}
