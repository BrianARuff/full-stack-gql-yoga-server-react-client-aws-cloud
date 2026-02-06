import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { getDDBClient } from "./database";
import { plugins } from "./plugins/index.js";
import { schema } from "./schema";
import "./tracing.js";
import { getRequiredEnv } from "./utils";

export type Context = {
  request: Request;
  ddb: DynamoDBDocumentClient;
};

const yoga = createYoga({
  schema: schema,
  graphqlEndpoint: "/graphql",
  context: ({ request }): Context => {
    const ddb = getDDBClient();

    return {
      request,
      ddb,
    };
  },
  cors: {
    origin:
      getRequiredEnv("AGQL_BE_NODE_ENV") !== "production"
        ? [
            "http://127.0.0.1:5173",
            "http://127.0.0.1:4173",
            "http://localhost:5173",
            "http://localhost:4173",
          ]
        : [
            "http://brian-books.click",
            "https://brian-books.click",
            "http://www.brian-books.click",
            "https://www.brian-books.click",
          ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  plugins,
  graphiql: getRequiredEnv("AGQL_BE_NODE_ENV") !== "production",
});

const server = createServer(yoga);

server.listen(Number(getRequiredEnv("AGQL_BE_PORT")), () => {
  console.log(
    `GraphQL ready at http://localhost:${getRequiredEnv("AGQL_BE_PORT")}${yoga.graphqlEndpoint}`,
  );
});
