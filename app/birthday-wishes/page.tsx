import fs from "fs";
import path from "path";
import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birthday wishes — Hello Saanvika",
  description:
    "Messages written in a fleeting moment — preserved exactly as they were, as a reminder of how deeply Saanvika was loved from the very beginning.",

  openGraph: {
    title: "Birthday wishes for Saanvika",
    description:
      "Words written without filters or planning — just honest wishes, preserved as they were.",
    url: "https://hellosaanvika.com/birthday-wishes",
    siteName: "Hello Saanvika",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Birthday wishes — Hello Saanvika",
      },
    ],
    type: "article",
  },

  twitter: {
    card: "summary_large_image",
    title: "Birthday wishes for Saanvika",
    description:
      "Honest words written in a fleeting moment — preserved with care.",
    images: ["/og-home.png"],
  },
};

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
    <main className="letter wishes">
      {/* Intro */}
      <article
        className="
          prose          
        "
        dangerouslySetInnerHTML={{ __html: introHtml }}
      />

      {/* Wishes */}
      <section className="mt-16">
        {wishes.map((wish, index) => (
          <div key={index} className="wish">
            <p className="wish-message">
              {wish.message}
            </p>
            <div className="wish-signature">
              — {wish.name}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
