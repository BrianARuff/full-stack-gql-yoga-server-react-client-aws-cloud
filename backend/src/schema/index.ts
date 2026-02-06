import { createSchema } from "graphql-yoga";
import { authSchemaTypeDefs, createAdminUser } from "./auth";
import {
  bookSchemaTypeDefs,
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "./books";
import { getIntroductionMessage, helloWorldTypeDefs } from "./helloWorld";

export const schema = createSchema({
  typeDefs: [helloWorldTypeDefs, authSchemaTypeDefs, bookSchemaTypeDefs],
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
