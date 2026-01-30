import { renderMarkdown } from "@/lib/markdown";

export default async function TheDayItAllBeganPage() {
  const contentHtml = await renderMarkdown(
    "content/the-day-it-all-began.md"
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article
        className="
          prose
          prose-invert
          prose-neutral
          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-h1:text-4xl
          prose-h2:text-2xl
          prose-p:leading-relaxed
          prose-li:leading-relaxed
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
