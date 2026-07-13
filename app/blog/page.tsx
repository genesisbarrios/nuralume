import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/libs/blogPosts";
import config from "@/config";

export const metadata: Metadata = {
  title: `Blog — ${config.appName}`,
  description:
    "Guides on meditation, yoga, Buddhist practice, the Law of One, and Hindu philosophy for beginners.",
};

export default function BlogIndexPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold">The Nuralume Blog</h1>
          <p className="mt-3 text-base-content/70">
            Practical guides to meditation, yoga, and the traditions behind
            them.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col rounded-2xl border border-base-300 p-6 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{post.emoji}</span>
                <span className="badge badge-primary badge-outline">
                  {post.tag}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-bold">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm text-base-content/70">
                {post.excerpt}
              </p>
              <p className="mt-4 text-xs text-base-content/50">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                &middot; {post.readTime}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
