export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: "Query";
  getBooks: Array<Book>;
};

export type QueryGetBooksArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createBook: Book;
  updateBook: Book;
  deleteBook: Book;
};

export type MutationCreateBookArgs = {
  input: CreateBookInput;
};

export type MutationUpdateBookArgs = {
  input: UpdateBookInput;
};

export type MutationDeleteBookArgs = {
  input: DeleteBookInput;
};

export type Book = {
  __typename?: "Book";
  id: Scalars["ID"];
  title: Scalars["String"];
  author: Scalars["String"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type CreateBookInput = {
  title: Scalars["String"];
  author: Scalars["String"];
};

export type UpdateBookInput = {
  id: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  author?: Maybe<Scalars["String"]>;
};

export type DeleteBookInput = {
  id: Scalars["ID"];
};
