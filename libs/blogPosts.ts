export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  emoji: string;
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "meditation-for-beginners",
    title: "Meditation for Beginners: A Simple Guide to Finding Stillness",
    excerpt:
      "You don't need a cushion, a mantra, or an hour to spare. Here's a practical, no-nonsense way to start meditating today.",
    date: "2026-01-12",
    readTime: "6 min read",
    tag: "Meditation",
    emoji: "🧘",
  },
  {
    slug: "yoga-for-mind-body-healing",
    title: "Yoga for Mind-Body Healing: Where Movement Meets Meditation",
    excerpt:
      "Yoga is moving meditation. Here's how breath and posture work together to calm the nervous system, plus four poses to start with.",
    date: "2026-02-03",
    readTime: "7 min read",
    tag: "Yoga",
    emoji: "🤸",
  },
  {
    slug: "introduction-to-buddhist-meditation",
    title: "An Introduction to Buddhist Meditation: Mindfulness, Vipassana, and Metta",
    excerpt:
      "Samatha, Vipassana, and Metta are the three pillars of Buddhist meditation practice. Here's what each one actually involves.",
    date: "2026-03-10",
    readTime: "8 min read",
    tag: "Buddhism",
    emoji: "☸️",
  },
  {
    slug: "what-is-the-law-of-one",
    title: "What Is the Law of One? An Introduction to the Ra Material",
    excerpt:
      "A neutral, descriptive look at the Law of One / Ra Material — its core ideas about densities, unity, and polarity.",
    date: "2026-04-18",
    readTime: "9 min read",
    tag: "Law of One",
    emoji: "✨",
  },
  {
    slug: "best-hinduism-books-for-beginners",
    title: "5 Hinduism Books Every Beginner Should Read",
    excerpt:
      "A curated reading list for anyone starting to explore Hindu philosophy — from the Bhagavad Gita to modern introductions to Vedanta.",
    date: "2026-05-22",
    readTime: "5 min read",
    tag: "Reading List",
    emoji: "📚",
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string, count = 2) {
  return BLOG_POSTS.filter((post) => post.slug !== slug).slice(0, count);
}
