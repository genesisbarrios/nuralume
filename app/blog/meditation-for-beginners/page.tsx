import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import BookRecommendations from "@/components/BookRecommendations";
import { getBlogPost } from "@/libs/blogPosts";

const post = getBlogPost("meditation-for-beginners")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  keywords: ["meditation for beginners", "how to meditate", "mindfulness"],
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
        Meditation has a reputation problem. Say the word and people picture
        an hour of silence, a perfectly cross-legged posture, and a mind that
        somehow goes blank on command. None of that is required to start —
        and most of it isn&apos;t even the point.
      </p>

      <h2>What meditation actually is</h2>
      <p>
        At its simplest, meditation is the practice of paying attention to
        one thing on purpose, and noticing when your attention wanders. That
        &ldquo;one thing&rdquo; is usually your breath, because it&apos;s
        always available and always happening in the present moment. The
        goal isn&apos;t to stop thinking — thoughts will keep showing up.
        The practice is in noticing a thought has pulled you away, and
        gently returning to the breath, over and over.
      </p>

      <h2>A technique to try today</h2>
      <p>
        Sit or lie down somewhere reasonably quiet. Close your eyes, or soften
        your gaze toward the floor. Take a few slower breaths, then let your
        breathing return to normal. Count each exhale, from one to ten, then
        start over at one. When you notice you&apos;ve lost count — and you
        will — just start again at one, without judgment. Five minutes is a
        complete session. There is no version of this you can do wrong.
      </p>

      <h2>What actually gets in the way, the first week</h2>
      <ul>
        <li>
          <strong>Racing thoughts.</strong> This isn&apos;t a sign you&apos;re
          bad at meditating — it&apos;s the reason to meditate. Every time you
          notice a thought and return to your breath, that&apos;s the
          exercise working.
        </li>
        <li>
          <strong>Restlessness.</strong> Five minutes can feel long at first.
          Shorten the session before you abandon it — even sixty seconds of
          focused breath counts.
        </li>
        <li>
          <strong>&ldquo;Am I doing this wrong?&rdquo;</strong> If you sat
          down and tried to pay attention to your breath, you did it
          correctly. Consistency matters far more than technique at the
          beginning.
        </li>
      </ul>

      <h2>Making it a daily habit</h2>
      <p>
        The single biggest predictor of whether meditation sticks is whether
        it&apos;s attached to something you already do — right after you wake
        up, or right before you brush your teeth at night. A short session
        with a calming tone in the background, like a Solfeggio frequency or
        a gentle binaural beat, can also make it easier to settle in, since
        it gives your attention something soft to rest on besides silence.
      </p>

      <h2>Books to read</h2>
      <BookRecommendations
        books={[
          {
            title: "Wherever You Go, There You Are",
            author: "Jon Kabat-Zinn",
            imageUrl: "https://covers.openlibrary.org/b/id/13536080-L.jpg",
            url: "https://www.amazon.com/Wherever-You-There-Are-Mindfulness/dp/0306832011",
          },
          {
            title: "10% Happier",
            author: "Dan Harris",
            imageUrl: "https://covers.openlibrary.org/b/id/10453375-L.jpg",
            url: "https://www.amazon.com/10-Happier-Self-Help-Actually-Works/dp/0062265431",
          },
          {
            title: "The Miracle of Mindfulness",
            author: "Thich Nhat Hanh",
            imageUrl: "https://covers.openlibrary.org/b/id/8262944-L.jpg",
            url: "https://www.amazon.com/Miracle-Mindfulness-Introduction-Practice-Meditation/dp/0807012394",
          },
        ]}
      />
    </BlogPostLayout>
  );
}
