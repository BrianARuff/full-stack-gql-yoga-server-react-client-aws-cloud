import { createSchema } from "graphql-yoga";
import { createAdminUser, createAdminUserTypeDefs } from "./auth";
import {
  bookSchemaTypeDefs,
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "./books";
import { getIntroductionMessage, helloWorldTypeDefs } from "./helloWorld";

export const schema = createSchema({
  typeDefs: [helloWorldTypeDefs, createAdminUserTypeDefs, bookSchemaTypeDefs],
  resolvers: {
    Query: {
      getBooks,
      getIntroductionMessage,
    },
    Mutation: {
      createBook,
      updateBook,
      deleteBook,
      createAdminUser,
    },
  },
});
