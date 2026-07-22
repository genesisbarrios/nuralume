import type { Metadata } from "next";
import Link from "next/link";
import BlogPostLayout from "@/components/BlogPostLayout";
import BookRecommendations from "@/components/BookRecommendations";
import { getBlogPost } from "@/libs/blogPosts";

const post = getBlogPost("buddhism-101-core-teachings")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  keywords: [
    "buddhism",
    "four noble truths",
    "eightfold path",
    "theravada",
    "mahayana",
    "vajrayana",
    "buddhist philosophy",
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
        Buddhism is often introduced through meditation — sit, breathe,
        notice the mind. That&apos;s a real and central part of the practice,
        but it sits on top of a body of teaching about the nature of
        suffering, self, and reality that&apos;s worth understanding on its
        own terms. Here&apos;s where Buddhism came from, what it actually
        teaches, and how its major schools diverge.
      </p>

      <h2>Where it started</h2>
      <p>
        Buddhism traces back to Siddhartha Gautama, a prince born in what is
        now Nepal around the 5th or 6th century BCE. According to tradition,
        he left a life of privilege after encountering old age, sickness, and
        death for the first time, and spent years as a wandering ascetic
        searching for a way to end suffering. After a period of meditation
        under a fig tree — the Bodhi tree — he reached a realization about the
        nature of suffering and its causes, and became &ldquo;the
        Buddha,&rdquo; meaning &ldquo;the awakened one.&rdquo; He spent the
        rest of his life teaching what he&apos;d realized, and those teachings
        were passed down orally before eventually being written down as the
        sutras.
      </p>

      <h2>The Four Noble Truths</h2>
      <p>
        The core of the Buddha&apos;s teaching is usually summarized as four
        statements, traditionally presented in the structure of a medical
        diagnosis: identify the illness, its cause, whether it can be cured,
        and the treatment.
      </p>
      <ul>
        <li>
          <strong>Dukkha — life involves suffering.</strong> Not just acute
          pain, but a pervasive unsatisfactoriness: even pleasant experiences
          are temporary and tinged with the anxiety of losing them.
        </li>
        <li>
          <strong>Samudaya — suffering has a cause.</strong> Craving and
          attachment — wanting things to be other than they are, clinging to
          what&apos;s pleasant and pushing away what isn&apos;t.
        </li>
        <li>
          <strong>Nirodha — suffering can end.</strong> Because it has a
          cause, it isn&apos;t a fixed feature of existence. Removing the
          craving removes the suffering it produces.
        </li>
        <li>
          <strong>Magga — there is a path to end it.</strong> A concrete,
          practical route: the Eightfold Path.
        </li>
      </ul>

      <h2>The Eightfold Path</h2>
      <p>
        The path is traditionally grouped into three areas — wisdom, ethical
        conduct, and mental discipline — rather than eight sequential steps:
      </p>
      <ul>
        <li>
          <strong>Wisdom:</strong> right view, right intention
        </li>
        <li>
          <strong>Ethical conduct:</strong> right speech, right action, right
          livelihood
        </li>
        <li>
          <strong>Mental discipline:</strong> right effort, right mindfulness,
          right concentration
        </li>
      </ul>
      <p>
        &ldquo;Right&rdquo; here doesn&apos;t mean a moral rulebook so much as
        <em> skillful</em> — action, speech, and thought that reduce
        suffering for yourself and others, rather than a fixed commandment to
        follow.
      </p>

      <h2>Other core concepts</h2>
      <ul>
        <li>
          <strong>Anicca (impermanence).</strong> Everything conditioned —
          thoughts, feelings, relationships, the body — is in constant flux.
          Clinging to permanence where none exists is a major source of
          suffering.
        </li>
        <li>
          <strong>Anatta (non-self).</strong> One of Buddhism&apos;s more
          distinctive claims: there is no fixed, unchanging self underlying
          experience — what we call &ldquo;self&rdquo; is a changing process,
          not a static thing.
        </li>
        <li>
          <strong>Karma and rebirth.</strong> Intentional actions have
          consequences that shape future experience, traditionally understood
          across multiple lifetimes, though some modern, secular
          interpretations focus on karma as a psychological pattern within a
          single life rather than a literal cycle of rebirth.
        </li>
        <li>
          <strong>Nirvana.</strong> The cessation of suffering and the
          craving that causes it — not a place, but the end of the process
          described in the Four Noble Truths.
        </li>
      </ul>

      <h2>The major schools</h2>
      <p>
        Buddhism split into distinct traditions over the centuries as it
        spread across Asia, differing in scripture, practice, and emphasis:
      </p>
      <ul>
        <li>
          <strong>Theravada (&ldquo;Teaching of the Elders&rdquo;).</strong>{" "}
          The oldest surviving school, dominant in Sri Lanka and Southeast
          Asia. Emphasizes the Pali Canon, individual liberation through
          monastic discipline and insight meditation, and a relatively literal
          reading of the earliest recorded teachings.
        </li>
        <li>
          <strong>Mahayana (&ldquo;Great Vehicle&rdquo;).</strong> Dominant in
          China, Japan, Korea, and Vietnam, and the source of well-known
          traditions like Zen and Pure Land Buddhism. Introduces the ideal of
          the bodhisattva — someone who delays their own final liberation to
          help all beings reach it — and a wider body of later scriptures.
        </li>
        <li>
          <strong>Vajrayana (&ldquo;Diamond Vehicle&rdquo;).</strong>{" "}
          Dominant in Tibet and the Himalayan region, sometimes considered a
          branch of Mahayana. Adds tantric practices, elaborate ritual,
          visualization, and mantra as accelerated routes to the same
          liberation Theravada and Mahayana describe.
        </li>
      </ul>
      <p>
        The differences are real, but the Four Noble Truths, the Eightfold
        Path, and concepts like impermanence and non-self are shared ground
        across all three — the schools diverge more in method and scripture
        than in the basic diagnosis of suffering and its cause.
      </p>

      <h2>How this connects to meditation</h2>
      <p>
        Meditation practices like mindfulness, Vipassana, and Metta — covered
        in more depth in{" "}
        <Link
          href="/blog/introduction-to-buddhist-meditation"
          className="text-primary hover:underline"
        >
          our guide to Buddhist meditation
        </Link>{" "}
        — aren&apos;t a separate wellness add-on to this framework; they&apos;re
        the mental discipline piece of the Eightfold Path, the practical
        method for directly observing impermanence and non-self rather than
        just accepting them as ideas.
      </p>

      <h2>Books to read</h2>
      <BookRecommendations
        books={[
          {
            title: "What the Buddha Taught",
            author: "Walpola Rahula",
            imageUrl: "https://covers.openlibrary.org/b/id/568525-L.jpg",
            url: "https://www.amazon.com/What-Buddha-Taught-Expanded-Dhammapada/dp/0802130313",
          },
          {
            title: "Buddhism Without Beliefs",
            author: "Stephen Batchelor",
            imageUrl: "https://covers.openlibrary.org/b/id/823956-L.jpg",
            url: "https://www.amazon.com/Buddhism-Without-Beliefs-Contemporary-Awakening/dp/1573226564",
          },
          {
            title: "The Heart of the Buddha's Teaching",
            author: "Thich Nhat Hanh",
            imageUrl: "https://covers.openlibrary.org/b/id/527670-L.jpg",
            url: "https://www.amazon.com/Heart-Buddhas-Teaching-Transforming-Liberation/dp/0767903692",
          },
        ]}
      />
    </BlogPostLayout>
  );
}
