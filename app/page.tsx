import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Hello Saanvika — A quiet journal of beginnings",
  description:
    "A personal digital journal preserving childhood moments, memories, and words written with love.",

  openGraph: {
    title: "Hello Saanvika",
    description: "A quiet journal of moments, memories, and becoming.",
    url: "https://hellosaanvika.com",
    siteName: "Hello Saanvika",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Hello Saanvika — a quiet journal",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Hello Saanvika — a quiet journal",
    description: "A quiet journal of moments, memories, and becoming.",
    images: ["/og-home.png"],
  },
};

export default async function HomePage() {
  const contentHtml = await renderMarkdown("content/home.md");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f9f7f2",
        color: "#1a1a1a",
      }}
    >
      <section
        className="letter"
        style={{          
          maxWidth: "640px",
          margin: "0 auto",
          padding: "96px 24px",
          textAlign: "center",
          lineHeight: "1.7",
        }}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}
