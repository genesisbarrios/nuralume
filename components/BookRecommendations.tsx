export interface BookRecommendation {
  title: string;
  author: string;
  imageUrl: string;
  url: string;
}

export default function BookRecommendations({
  books,
}: {
  books: BookRecommendation[];
}) {
  return (
    <div className="not-prose mt-4 grid gap-4 sm:grid-cols-2">
      {books.map((book) => (
        <a
          key={book.title}
          href={book.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex gap-4 rounded-xl border border-base-300 p-4 transition-colors hover:border-primary"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            className="h-28 w-20 flex-none rounded object-cover shadow"
            loading="lazy"
          />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold">{book.title}</p>
            <p className="mt-1 text-xs text-base-content/60">{book.author}</p>
            <span className="mt-2 text-xs font-medium text-primary">
              View on Amazon &rarr;
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
