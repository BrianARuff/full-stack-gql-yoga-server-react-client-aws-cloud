import { Plugin } from "graphql-yoga";
import { Context } from "..";
import { getRequiredEnv } from "../utils";

export const useTracingExtensions = (): Plugin<Context> => {
  const isProduction = getRequiredEnv("AGQL_BE_NODE_ENV") === "production";

  if (isProduction) {
    return {};
  }

  const executionTimings = new WeakMap<Request, bigint>();

  return {
    onRequest({ request }) {
      executionTimings.set(request, process.hrtime.bigint());
    },
    onResultProcess({ request, result, setResult }) {
      const startTime = executionTimings.get(request);
      const endTime = process.hrtime.bigint();
      const durationNs = startTime ? Number(endTime - startTime) : null;

      const tracing = {
        version: 1,
        startTime: new Date().toISOString(),
        duration: durationNs,
        durationMs: durationNs ? durationNs / 1_000_000 : null,
      };

      // Handle both successful responses and error responses
      if (result) {
        setResult({
          ...result,
          extensions: {
            ...((result as any).extensions || {}),
            tracing,
          },
        });
      }
    },
  };
};
