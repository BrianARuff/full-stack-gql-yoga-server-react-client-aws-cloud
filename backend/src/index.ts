import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { env } from "./config.js";
import { getDDBClient } from "./database";
import { plugins } from "./plugins/index.js";
import { schema } from "./schema";
import "./tracing.js";

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
  plugins,
  graphiql: process.env.NODE_ENV !== "production",
});

const server = createServer(yoga);

server.listen(env.PORT, () => {
  console.log(
    `GraphQL ready at http://localhost:${env.PORT}${yoga.graphqlEndpoint}`,
  );
});
