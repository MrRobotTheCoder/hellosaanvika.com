import { renderMarkdown } from "@/lib/markdown";

export default async function SimpleFirstBirthdayReflection() {
  const contentHtml = await renderMarkdown(
    "content/reflections/a-simple-first-birthday-at-home.md"
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
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
