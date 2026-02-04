import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A simple first birthday at home — Hello Saanvika",
  description:
    "A quiet reflection on celebrating a first birthday at home, surrounded by familiarity, warmth, and unhurried moments.",
  openGraph: {
    title: "A simple first birthday at home",
    description:
      "A calm reflection on a first birthday spent at home, unfolding gently and remembered quietly.",
    type: "article",
  },
};

export default async function SimpleFirstBirthdayReflection() {
  const contentHtml = await renderMarkdown(
    "content/reflections/a-simple-first-birthday-at-home.md"
  );

  return (
    <main className="letter">
      <article
        className="
          prose          
          prose-neutral
          mx-auto
          text-center
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
