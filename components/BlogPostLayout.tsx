import Link from "next/link";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getRelatedPosts, type BlogPostMeta } from "@/libs/blogPosts";

export default function BlogPostLayout({
  post,
  children,
}: {
  post: BlogPostMeta;
  children: ReactNode;
}) {
  const related = getRelatedPosts(post.slug);

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Link
              href="/blog"
              className="text-sm text-primary hover:underline"
            >
              &larr; Back to blog
            </Link>
            <div className="mt-4 text-5xl">{post.emoji}</div>
            <span className="badge badge-primary badge-outline mt-4">
              {post.tag}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-base-content/60">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              &middot; {post.readTime}
            </p>
          </div>
        </section>

        <article className="prose prose-slate mx-auto max-w-3xl px-4 py-12 sm:px-6 prose-headings:font-handwritten prose-headings:text-2xl">
          {children}
        </article>

        <section className="bg-gradient-to-br from-primary to-secondary py-12 text-primary-content">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold">Bring this into your day</h2>
            <p className="mt-2 text-primary-content/90">
              Nuralume pairs practices like this with healing music,
              affirmations, and gentle reminders.
            </p>
            <Link
              href="/login"
              className="btn btn-lg mt-6 border-none bg-base-100 text-base-content hover:bg-base-200"
            >
              Try Nuralume free
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 className="mb-4 font-handwritten text-2xl">Keep reading</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="rounded-xl border border-base-300 p-4 transition-colors hover:border-primary"
              >
                <div className="text-2xl">{r.emoji}</div>
                <p className="mt-2 text-sm font-semibold">{r.title}</p>
                <p className="mt-1 text-xs text-base-content/60">
                  {r.readTime}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
