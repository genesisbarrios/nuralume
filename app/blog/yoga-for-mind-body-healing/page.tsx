import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import BookRecommendations from "@/components/BookRecommendations";
import { getBlogPost } from "@/libs/blogPosts";

const post = getBlogPost("yoga-for-mind-body-healing")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  keywords: ["yoga for beginners", "mind body healing", "yoga and meditation"],
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
        It&apos;s easy to think of yoga and meditation as two separate
        practices — one for the body, one for the mind. In its original
        form, yoga was never meant to be split that way. The postures
        (asana) exist to prepare the body to sit still, so the mind can
        settle. Movement and stillness were always meant to work together.
      </p>

      <h2>Yoga as moving meditation</h2>
      <p>
        What makes yoga meditative isn&apos;t the shapes your body makes —
        it&apos;s the attention you bring to them. Synchronizing breath with
        movement (inhaling as you lengthen, exhaling as you fold) keeps your
        attention anchored in the present moment, the same way counting
        breaths does in seated meditation. This is also what activates the
        parasympathetic nervous system — the &ldquo;rest and digest&rdquo;
        state that lowers heart rate and eases the body out of stress
        response.
      </p>

      <h2>Four poses to start with</h2>
      <ul>
        <li>
          <strong>Child&apos;s Pose (Balasana).</strong> A resting posture
          that gently stretches the back while calming the nervous system —
          a good place to return to whenever a sequence feels like too much.
        </li>
        <li>
          <strong>Cat-Cow (Marjaryasana-Bitilasana).</strong> A slow spinal
          flow, paired one-to-one with the breath: inhale to arch, exhale to
          round. It&apos;s often the first place people feel the
          breath-movement connection click.
        </li>
        <li>
          <strong>Forward Fold (Uttanasana).</strong> A gentle inversion that
          can quiet a busy mind, especially useful before a seated meditation
          session.
        </li>
        <li>
          <strong>Legs-Up-The-Wall (Viparita Karani).</strong> A restorative
          pose, held for several minutes, that&apos;s closer to meditation
          than exercise — good for winding down at the end of the day.
        </li>
      </ul>

      <h2>Complementary, not competing</h2>
      <p>
        You don&apos;t need to choose between a seated meditation practice
        and a yoga practice. Many people find it easier to sit still after
        moving first — the body settles, and the mind follows. If seated
        stillness feels difficult right now, a short yoga sequence might be
        the better entry point into meditation altogether.
      </p>

      <h2>Books to read</h2>
      <BookRecommendations
        books={[
          {
            title: "Light on Yoga",
            author: "B.K.S. Iyengar",
            imageUrl: "https://covers.openlibrary.org/b/id/8244-L.jpg",
            url: "https://www.amazon.com/Light-Yoga-Bible-Modern/dp/0805210318",
          },
          {
            title: "The Heart of Yoga",
            author: "T.K.V. Desikachar",
            imageUrl: "https://covers.openlibrary.org/b/id/1650716-L.jpg",
            url: "https://www.amazon.com/Heart-Yoga-Developing-Personal-Practice/dp/0892815337",
          },
          {
            title: "Yoga Anatomy",
            author: "Leslie Kaminoff",
            imageUrl: "https://covers.openlibrary.org/b/id/462290-L.jpg",
            url: "https://www.amazon.com/Yoga-Anatomy-Leslie-Kaminoff/dp/0736062785",
          },
        ]}
      />
    </BlogPostLayout>
  );
}
