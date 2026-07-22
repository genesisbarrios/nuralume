import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import BookRecommendations from "@/components/BookRecommendations";
import { getBlogPost } from "@/libs/blogPosts";

const post = getBlogPost("introduction-to-buddhist-meditation")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  keywords: ["buddhist meditation", "vipassana", "metta meditation", "mindfulness"],
  openGraph: {
    title: post.title,
    description: post.excerpt,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.excerpt,
  },
  alternates: { canonical: `/blog/${post.slug}` },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Most of the meditation apps and techniques common in the West today
        trace their roots back to Buddhist practice, even when the framing
        is entirely secular. Understanding where these techniques came from
        can make them easier to practice with intention, whether or not you
        identify as Buddhist at all.
      </p>

      <h2>A brief, practical grounding</h2>
      <p>
        Buddhist teaching begins with the Four Noble Truths: that suffering
        is a part of life, that it arises from craving and attachment, that
        it can end, and that there is a path to end it. Meditation is part
        of that path — not an escape from difficulty, but a way of relating
        to it differently. You don&apos;t need to accept any of this as
        belief to benefit from the techniques it produced.
      </p>

      <h2>Three traditions, three purposes</h2>
      <ul>
        <li>
          <strong>Samatha (calm-abiding).</strong> The foundation practice —
          training attention to rest steadily on one object, usually the
          breath. This is the closest to what most beginners picture when
          they hear &ldquo;meditation,&rdquo; and it&apos;s the practice
          that builds the concentration the other two rely on.
        </li>
        <li>
          <strong>Vipassana (insight).</strong> Once attention is stable,
          Vipassana turns it toward direct observation of experience itself —
          noticing sensations, thoughts, and emotions arise and pass, without
          grabbing onto them. The aim is to see clearly how transient every
          mental state actually is.
        </li>
        <li>
          <strong>Metta (loving-kindness).</strong> A practice of deliberately
          generating goodwill — traditionally starting with yourself, then
          extending outward to loved ones, neutral people, difficult people,
          and eventually all beings. It&apos;s often the most immediately
          mood-lifting of the three.
        </li>
      </ul>

      <h2>Where to start</h2>
      <p>
        If you&apos;re new to all three, Samatha is the natural entry point —
        it&apos;s the skill the other two are built on. A simple version:
        five to ten minutes of breath-counting, daily, for two weeks, before
        introducing Vipassana or Metta. There&apos;s no need to rush the
        sequence, and no requirement to adopt any particular belief system to
        benefit from the practice.
      </p>

      <h2>Books to read</h2>
      <BookRecommendations
        books={[
          {
            title: "Mindfulness in Plain English",
            author: "Bhante Henepola Gunaratana",
            imageUrl: "https://covers.openlibrary.org/b/id/652683-L.jpg",
            url: "https://www.amazon.com/Mindfulness-English-Bhante-Henepola-Gunaratana/dp/0861719069",
          },
          {
            title: "Loving-Kindness: The Revolutionary Art of Happiness",
            author: "Sharon Salzberg",
            imageUrl: "https://covers.openlibrary.org/b/id/817037-L.jpg",
            url: "https://www.amazon.com/Loving-Kindness-Revolutionary-Happiness-Sharon-Salzberg/dp/1570620377",
          },
          {
            title: "The Experience of Insight",
            author: "Joseph Goldstein",
            imageUrl: "https://covers.openlibrary.org/b/id/4280626-L.jpg",
            url: "https://www.amazon.com/Experience-Insight-Natural-Unfolding/dp/0913300055",
          },
        ]}
      />
    </BlogPostLayout>
  );
}
