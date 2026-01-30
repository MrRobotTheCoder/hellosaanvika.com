import fs from "fs";
import path from "path";
import { renderMarkdown } from "@/lib/markdown";

type Wish = {
  name: string;
  message: string;
  time: string;
};

export default async function BirthdayWishesPage() {
  // Load intro markdown
  const introHtml = await renderMarkdown("content/birthday-wishes.md");

  // Load wishes JSON
  const wishesPath = path.join(
    process.cwd(),
    "data/birthday-wishes.json"
  );
  const wishesRaw = fs.readFileSync(wishesPath, "utf8");
  const wishes: Wish[] = JSON.parse(wishesRaw);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Intro */}
      <article
        className="
          prose
          prose-invert
          prose-neutral
          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-p:leading-relaxed
        "
        dangerouslySetInnerHTML={{ __html: introHtml }}
      />

      {/* Wishes */}
      <section className="mt-16 space-y-10">
        {wishes.map((wish, index) => (
          <blockquote
            key={index}
            className="border-l-2 border-neutral-700 pl-6"
          >
            <p className="text-lg leading-relaxed text-neutral-100">
              {wish.message}
            </p>
            <footer className="mt-2 text-sm text-neutral-400">
              — {wish.name}
            </footer>
          </blockquote>
        ))}
      </section>
    </main>
  );
}
