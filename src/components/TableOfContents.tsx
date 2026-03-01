"use client";

import { Chapter } from "@/types/book";

interface Props {
  chapters: Chapter[];
  currentIndex: number;
  onSelect: (href: string, index: number) => void;
}

export default function TableOfContents({
  chapters,
  currentIndex,
  onSelect,
}: Props) {
  return (
    <nav className="h-full overflow-y-auto">
      <ul>
        {chapters.map((chapter) => {
          const isActive = chapter.index === currentIndex;
          return (
            <li key={chapter.id}>
              <button
                onClick={() => onSelect(chapter.href, chapter.index)}
                className={[
                  "w-full text-left px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "border-l-4 border-[#7c5cbf] bg-[#7c5cbf]/10 font-semibold text-[#7c5cbf] pl-3"
                    : "border-l-4 border-transparent hover:bg-gray-100 text-gray-700",
                ].join(" ")}
              >
                {chapter.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
