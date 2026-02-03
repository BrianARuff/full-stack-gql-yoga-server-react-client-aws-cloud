import { memo } from "react";
import type { Book } from "./graphql";
import { formatDate } from "./utils/formatDate";

type BookArticleProps = {
  book: Book;
  isLast: boolean;
};

export const BookArticle = memo(({ book, isLast }: BookArticleProps) => {
  return (
    <article aria-labelledby={`book-title-${book.id}`}>
      <dl className="book-details">
        <div className="subtitle-text">
          <dt className="visually-hidden">ID</dt>
          <dd>
            <strong>ID:</strong> {book.id}
          </dd>
        </div>
        <div className="subtitle-text">
          <dt className="visually-hidden">Title</dt>
          <dd id={`book-title-${book.id}`}>
            <strong>Title:</strong> {book.title}
          </dd>
        </div>
        <div className="subtitle-text">
          <dt className="visually-hidden">Author</dt>
          <dd>
            <strong>Author:</strong> {book.author}
          </dd>
        </div>
        <div className="subtitle-text">
          <dt className="visually-hidden">Created At</dt>
          <dd>
            <strong>Created At:</strong> {formatDate(book.createdAt)}
          </dd>
        </div>
        <div className="subtitle-text">
          <dt className="visually-hidden">Updated At</dt>
          <dd>
            <strong>Updated At:</strong> {formatDate(book.updatedAt)}
          </dd>
        </div>
      </dl>
      {!isLast && <hr className="divider" aria-hidden="true" />}
    </article>
  );
});

BookArticle.displayName = "BookArticle";
