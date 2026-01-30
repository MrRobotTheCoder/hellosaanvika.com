import Image from "next/image";
import { renderMarkdown } from "@/lib/markdown";

export default async function HomePage() {
  const contentHtml = await renderMarkdown("content/home.md");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Hero */}
      <section className="mb-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Hello Saanvika.
        </h1>

        <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10">
          A living story of childhood, memories, and milestones.
        </p>

        <div className="relative mx-auto max-w-3xl">
          <Image
            src="/images/hero.jpg"
            alt="A calm beginning to a lifelong story"
            width={1600}
            height={900}
            className="rounded-xl object-cover"
            priority
          />
        </div>
      </section>

      {/* Content */}
      <article
        className="
          prose
          prose-invert
          prose-neutral
          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-h2:text-2xl
          prose-p:leading-relaxed
          prose-li:leading-relaxed
          prose-ul:pl-6
          prose-ul:list-disc
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
