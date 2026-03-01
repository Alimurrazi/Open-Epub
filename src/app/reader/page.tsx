"use client";

import dynamic from "next/dynamic";

const ReaderContent = dynamic(() => import("@/components/ReaderContent"), {
  ssr: false,
});

export default function ReaderPage() {
  return <ReaderContent />;
}
