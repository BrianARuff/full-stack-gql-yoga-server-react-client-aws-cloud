import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { env } from "./config.js";
import { getDDBClient } from "./database";
import { plugins } from "./plugins/index.js";
import { schema } from "./schema";

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
  // graphiql: env.NODE_ENV !== 'production', // uncomment if you want to disable in prod
});

const server = createServer(yoga);

server.listen(env.PORT, () => {
  console.log(
    `GraphQL ready at http://localhost:${env.PORT}${yoga.graphqlEndpoint}`,
  );
});

// import hooks from "node:async_hooks"

// const createTrace = hooks.createHook({
//   init(asyncId, type, triggerAsyncId, resource) {
//     const eid = hooks.executionAsyncId();
//     console.log(`init: asyncId=${asyncId}, type=${type}, triggerAsyncId=${triggerAsyncId}, executionAsyncId=${eid}`);
//   },
//   before(asyncId) {
//     const eid = hooks.executionAsyncId();
//     console.log(`before: asyncId=${asyncId}, executionAsyncId=${eid}`);
//   },
//   after(asyncId) {
//     const eid = hooks.executionAsyncId();
//     console.log(`after: asyncId=${asyncId}, executionAsyncId=${eid}`);
//   },
//   destroy(asyncId) {
//     const eid = hooks.executionAsyncId();
//     console.log(`destroy: asyncId=${asyncId}, executionAsyncId=${eid}`);
//   },
// });

// createTrace.enable();
