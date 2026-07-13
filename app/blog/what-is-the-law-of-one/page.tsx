import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import { getBlogPost } from "@/libs/blogPosts";

const post = getBlogPost("what-is-the-law-of-one")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  keywords: ["law of one", "ra material", "densities of consciousness"],
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
        The Law of One, also known as the Ra Material, is a body of
        channeled sessions recorded between 1981 and 1984, later published
        as a series of books. It presents itself as a conversation between a
        research group and an entity identifying as &ldquo;Ra.&rdquo; Whether
        or not you take the channeling itself literally, the philosophy it
        lays out has become a recognizable framework within the wellness and
        spiritual-exploration space — worth understanding descriptively, the
        same way you might learn the basics of Stoicism or Taoism.
      </p>

      <h2>The core premise: unity of consciousness</h2>
      <p>
        The central claim of the Law of One is exactly what the name
        suggests: that all consciousness, across all forms, is ultimately
        one thing, temporarily experiencing itself as separate. Every
        person, and every other form of awareness, is framed as a
        &ldquo;distortion&rdquo; of this single, undivided source —
        different expressions of the same underlying unity.
      </p>

      <h2>Densities: stages of development</h2>
      <p>
        Rather than describing spiritual growth as linear self-improvement,
        the material organizes existence into seven &ldquo;densities,&rdquo;
        each representing a different depth of awareness and experience —
        from mineral and plant-like awareness in the earliest densities, up
        through self-conscious individuality (where most human experience is
        placed), and eventually toward states of near-total unity with the
        source. It&apos;s presented less as a ladder to climb quickly, and
        more as a description of where different forms of consciousness
        currently sit.
      </p>

      <h2>Polarity: service-to-others and service-to-self</h2>
      <p>
        A distinctive idea in the Law of One is that spiritual development
        isn&apos;t only about becoming &ldquo;more positive&rdquo; — it
        proposes two valid, opposite paths: service-to-others, oriented
        around giving and connection, and service-to-self, oriented around
        power and self-focus. Both are described as legitimate ways of
        deepening one&apos;s experience of consciousness, though the
        material is candid that it considers service-to-others the gentler
        and more common path.
      </p>

      <h2>One lens among many</h2>
      <p>
        The Law of One isn&apos;t presented here as fact, and it doesn&apos;t
        need to be adopted wholesale to be interesting. Like many spiritual
        frameworks, its value for a lot of readers is less about literal
        truth and more about the questions it raises: What would it mean if
        separateness were an illusion? What would &ldquo;service to
        others&rdquo; look like as a daily practice, rather than an abstract
        ideal? Those questions are worth sitting with regardless of where you
        land on the material itself.
      </p>
    </BlogPostLayout>
  );
}
