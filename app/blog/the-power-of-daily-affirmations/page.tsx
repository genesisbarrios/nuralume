import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import BookRecommendations from "@/components/BookRecommendations";
import { getBlogPost } from "@/libs/blogPosts";

const post = getBlogPost("the-power-of-daily-affirmations")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  keywords: [
    "daily affirmations",
    "how to write affirmations",
    "self-affirmation theory",
    "positive affirmations that work",
  ],
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
        Affirmations have a branding problem. Said the wrong way, they sound
        like empty positivity — staring in a mirror repeating something you
        don&apos;t believe. Said the right way, they&apos;re a genuinely
        useful tool, backed by real psychology, for gradually shifting how
        you talk to yourself. The difference is almost entirely in how
        they&apos;re written.
      </p>

      <h2>The psychology behind them</h2>
      <p>
        The research base for affirmations mostly comes from{" "}
        <strong>self-affirmation theory</strong>, developed by psychologist
        Claude Steele in the 1980s. The core finding: when people reflect on
        their core values and strengths, it measurably reduces defensiveness
        and stress, and makes them more receptive to feedback and change.
        Later research extended this to show that affirmations can lower
        cortisol response under stress and support better follow-through on
        goals. The mechanism isn&apos;t magic — it&apos;s that a short,
        repeated act of self-reflection changes what&apos;s at the top of
        your mind, which in turn shapes behavior over time. That&apos;s also
        why one-off affirmations rarely do much: the effect comes from
        repetition, not a single powerful moment.
      </p>

      <h2>Why most affirmations fail</h2>
      <p>
        The most common mistake is writing an affirmation so far from what
        you currently believe that saying it triggers pushback instead of
        acceptance. Telling yourself &ldquo;I am completely confident in
        every situation&rdquo; when you&apos;re anxious about a specific
        thing tends to backfire — your mind immediately supplies
        counter-evidence. Effective affirmations are believable stretches,
        not fantasies.
      </p>

      <h2>A framework for writing ones that work</h2>
      <ul>
        <li>
          <strong>Present tense.</strong> &ldquo;I am&rdquo; or &ldquo;I
          choose,&rdquo; not &ldquo;I will be.&rdquo; The present tense
          frames the quality as already available to you, not a future
          reward.
        </li>
        <li>
          <strong>Specific, not generic.</strong> &ldquo;I stay calm when
          plans change&rdquo; does more work than &ldquo;I am
          calm.&rdquo; Specificity gives your mind something concrete to
          hold onto.
        </li>
        <li>
          <strong>Believable.</strong> If an affirmation feels like a lie the
          moment you say it, soften it. &ldquo;I am learning to trust
          myself&rdquo; is more durable than &ldquo;I always trust
          myself,&rdquo; especially early on.
        </li>
        <li>
          <strong>Emotionally resonant.</strong> The ones that stick are
          usually tied to something you actually care about, not a phrase
          borrowed from somewhere else because it sounded good.
        </li>
        <li>
          <strong>Short enough to remember.</strong> If you can&apos;t recall
          it without looking, it won&apos;t come to mind in the moment you
          need it.
        </li>
      </ul>

      <h2>Making it a daily practice</h2>
      <p>
        Consistency matters more than intensity. A minute of affirmations
        every morning will outperform an occasional long session — the
        research on self-affirmation is fundamentally about repetition
        reshaping default thought patterns, not one-time persuasion. Pairing
        the practice with something you already do daily — coffee, a
        commute, brushing your teeth — makes it far more likely to stick
        than trying to build a new standalone habit from scratch.
      </p>
      <p>
        Start with two or three affirmations tied to something specific
        you&apos;re working on, say them like you mean them, and give it a
        few weeks before judging whether it&apos;s working. The shift is
        rarely dramatic day-to-day — it shows up as a slightly different
        first reaction the next time something stressful happens.
      </p>

      <h2>Books to read</h2>
      <BookRecommendations
        books={[
          {
            title: "You Can Heal Your Life",
            author: "Louise Hay",
            imageUrl: "https://covers.openlibrary.org/b/id/715608-L.jpg",
            url: "https://www.amazon.com/You-Can-Heal-Your-Life/dp/0937611018",
          },
          {
            title: "Mirror Work",
            author: "Louise Hay",
            imageUrl: "https://covers.openlibrary.org/b/id/12416061-L.jpg",
            url: "https://www.amazon.com/Mirror-Work-Days-Heal-Your/dp/1401949827",
          },
          {
            title: "What to Say When You Talk to Yourself",
            author: "Shad Helmstetter",
            imageUrl: "https://covers.openlibrary.org/b/id/809459-L.jpg",
            url: "https://www.amazon.com/What-Say-When-Talk-Yourself/dp/1567310028",
          },
        ]}
      />
    </BlogPostLayout>
  );
}
