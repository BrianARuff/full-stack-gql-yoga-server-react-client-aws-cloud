import { useQuery } from "@apollo/client/react";
import { useCallback } from "react";
import { useAuth } from "./AuthContext";
import { BookArticle } from "./BookArticle";
import { ErrorMessage } from "./ErrorMessage";
import { Loader } from "./Loader";
import type { GetBooksData } from "./graphql";
import { GET_BOOKS_QUERY } from "./graphql/books/queries";
import { extractErrorMessages } from "./utils/extractErrorMessages";
import { isAuthorizationError } from "./utils/isAuthorizationError";

export const BookArticles = () => {
  const { user } = useAuth();
  const { loading, error, data, refetch } = useQuery<GetBooksData>(
    GET_BOOKS_QUERY,
    {
      fetchPolicy: "no-cache",
      notifyOnNetworkStatusChange: true,
    },
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (loading && !data) {
    return <Loader />;
  }

  if (error) {
    const errorMessages = extractErrorMessages(error);
    const isAuthError = isAuthorizationError(error);
    const username = user?.getUsername() ?? "User";

    return (
      <section
        className="user-attributes-container"
        aria-labelledby="books-heading-error"
      >
        <h2 id="books-heading-error" className="subtitle-text">
          Books
        </h2>
        {isAuthError ? (
          <p className="info-message">
            {username} does not have permission to view books. Please contact an
            administrator to request access.
          </p>
        ) : (
          <p className="info-message">An error occurred while loading books.</p>
        )}
        <ErrorMessage message={errorMessages} />
        {!isAuthError && (
          <button type="button" onClick={handleRetry}>
            Retry
          </button>
        )}
      </section>
    );
  }

  const books = data?.getBooks ?? [];

  if (books.length === 0) {
    return (
      <section aria-labelledby="books-heading-empty">
        <h2 id="books-heading-empty" className="subtitle-text">
          Books
        </h2>
        <p className="info-message">No books found.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="books-heading">
      <h2 id="books-heading" className="subtitle-text">
        Books ({books.length})
      </h2>
      <div className="user-attributes-container">
        {books.map((book, index) => (
          <BookArticle
            key={book.id}
            book={book}
            isLast={index === books.length - 1}
          />
        ))}
      </div>
    </section>
  );
};
