import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Loader } from "./Loader";

const GET_BOOKS_QUERY = gql`
  query GetBooks {
    getBooks {
      id
      title
      author
      createdAt
      updatedAt
    }
  }
`;

type Book = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export const Books = () => {
  const { loading, error, data } = useQuery<{ getBooks: Book[] }>(
    GET_BOOKS_QUERY,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  if (loading) return <Loader />;

  if (error) return null;

  return (
    <div>
      <h2 className="subtitle-text">Books</h2>
      <div className="user-attributes-container">
        {data?.getBooks?.map((book, index) => (
          <div key={book.id}>
            <div className="subtitle-text">
              <strong>ID:</strong> {book.id}
            </div>
            <div className="subtitle-text">
              <strong>Title:</strong> {book.title}
            </div>
            <div className="subtitle-text">
              <strong>Author:</strong> {book.author}
            </div>
            <div className="subtitle-text">
              <strong>Created At:</strong> {book.createdAt}
            </div>
            <div className="subtitle-text">
              <strong>Updated At:</strong> {book.updatedAt}
            </div>
            {index < data.getBooks.length - 1 ? (
              <hr className="divider" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
