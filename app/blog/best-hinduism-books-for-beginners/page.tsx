import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import BookRecommendations from "@/components/BookRecommendations";
import { getBlogPost } from "@/libs/blogPosts";

const post = getBlogPost("best-hinduism-books-for-beginners")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  keywords: ["hinduism books", "bhagavad gita", "upanishads", "vedanta for beginners"],
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
        Hindu philosophy is vast — thousands of years of texts, schools of
        thought, and regional traditions, without a single central authority
        or canon the way some other religions have. That can make it
        intimidating to start. These five books are a reasonable, well-worn
        path in, roughly in the order most beginners find easiest.
      </p>

      <h2>1. The Bhagavad Gita (Eknath Easwaran translation)</h2>
      <p>
        A conversation between the warrior Arjuna and Krishna on the eve of
        battle, the Gita is the most widely read text in Hindu philosophy
        and a natural starting point. Easwaran&apos;s translation is
        praised for being both accessible to newcomers and faithful to the
        text&apos;s meaning, with an introduction that gives essential
        context before you begin.
      </p>

      <h2>2. The Upanishads (Easwaran translation, selected)</h2>
      <p>
        Where the Gita is narrative, the Upanishads are closer to
        philosophical dialogue — the foundational texts behind concepts like
        Brahman (ultimate reality) and Atman (the self). They can be dense in
        the original, so a well-annotated, selected translation is far more
        approachable for a first read than attempting the complete texts.
      </p>

      <h2>3. Autobiography of a Yogi by Paramahansa Yogananda</h2>
      <p>
        Part memoir, part spiritual teaching, this book introduced many
        Western readers to Hindu spirituality in an accessible, story-driven
        form. It&apos;s less a philosophical text than a lived account of
        one teacher&apos;s path — a good counterbalance to the denser
        material above.
      </p>

      <h2>4. Vedanta: Heart of Hinduism by Hans Torwesten</h2>
      <p>
        Vedanta is the philosophical school that grew out of the Upanishads,
        and Torwesten&apos;s overview helps connect the concepts across the
        texts above into a coherent framework, rather than leaving them as
        isolated ideas.
      </p>

      <h2>5. The Hindu Mind by Bansi Pandit</h2>
      <p>
        A practical, broad overview of Hindu beliefs, practices, and
        terminology, useful as a reference to return to as you encounter
        unfamiliar concepts or terms in the texts above.
      </p>

      <h2>A note on approach</h2>
      <p>
        You don&apos;t need to read these in order, or read all five before
        the material starts to click. Starting with the Gita, then returning
        to the others as questions come up, is a well-worn and effective
        path into the tradition.
      </p>

      <h2>Where to find these books</h2>
      <BookRecommendations
        books={[
          {
            title: "The Bhagavad Gita",
            author: "translated by Eknath Easwaran",
            imageUrl: "https://covers.openlibrary.org/b/id/1955084-L.jpg",
            url: "https://www.amazon.com/Bhagavad-Gita-2nd-Eknath-Easwaran/dp/1586380192",
          },
          {
            title: "The Upanishads",
            author: "translated by Eknath Easwaran",
            imageUrl: "https://covers.openlibrary.org/b/id/1955086-L.jpg",
            url: "https://www.amazon.com/Upanishads-2nd-Eknath-Easwaran/dp/1586380214",
          },
          {
            title: "Autobiography of a Yogi",
            author: "Paramahansa Yogananda",
            imageUrl: "https://covers.openlibrary.org/b/id/805448-L.jpg",
            url: "https://www.amazon.com/Autobiography-Self-Realization-Fellowship-Paramahansa-Yogananda/dp/0876120796",
          },
          {
            title: "Vedanta: Heart of Hinduism",
            author: "Hans Torwesten",
            imageUrl: "https://covers.openlibrary.org/b/id/9685954-L.jpg",
            url: "https://www.amazon.com/Vedanta-Heart-Hinduism-Hans-Torwesten/dp/0802110428",
          },
          {
            title: "The Hindu Mind",
            author: "Bansi Pandit",
            imageUrl: "https://covers.openlibrary.org/b/id/726994-L.jpg",
            url: "https://www.amazon.com/Hindu-Mind-Bansi-Pandit/dp/0963479849",
          },
        ]}
      />
    </BlogPostLayout>
  );
}
