import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The day it all began — Hello Saanvika",
  description:
    "The first chapter of a quiet journal — where a simple birthday moment became the beginning of something lasting.",

  openGraph: {
    title: "The day it all began",
    description:
      "Where a simple birthday moment quietly became the first chapter of a longer story.",
    url: "https://hellosaanvika.com/the-day-it-all-began",
    siteName: "Hello Saanvika",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "The day it all began — Hello Saanvika",
      },
    ],
    type: "article",
  },

  twitter: {
    card: "summary_large_image",
    title: "The day it all began",
    description:
      "The first chapter of a quiet journal — where everything started.",
    images: ["/og-home.png"],
  },
};

export default async function TheDayItAllBeganPage() {
  const contentHtml = await renderMarkdown(
    "content/the-day-it-all-began.md"
  );

  return (
    <main className="letter">
      <article
        className="
          prose
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
