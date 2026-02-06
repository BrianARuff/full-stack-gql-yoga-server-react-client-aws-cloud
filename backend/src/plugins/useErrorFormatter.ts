import { Plugin } from "graphql-yoga";
import { Context } from "..";
import { getRequiredEnv } from "../utils";

export const useErrorFormatter = (): Plugin<Context> => {
  const isProduction = getRequiredEnv("AGQL_BE_NODE_ENV") === "production";

  return {
    onResultProcess({ result, setResult }) {
      if (result && "errors" in result && Array.isArray(result.errors)) {
        const formattedErrors = result.errors.map((error) => {
          const formatted: {
            message: string;
            locations?: Array<{ line: number; column: number }>;
            path?: ReadonlyArray<string | number>;
            extensions?: Record<string, unknown>;
          } = {
            message: error.message,
          };

          // Include locations in non-production
          if (!isProduction && error.locations) {
            formatted.locations = error.locations;
          }

          // Always include path if available
          if (error.path) {
            formatted.path = error.path;
          }

          // Include extensions but remove stack trace in production
          if (error.extensions) {
            const extensions = { ...error.extensions };
            if (isProduction) {
              delete extensions.stacktrace;
              delete extensions.stack;
              delete extensions.error;
            }
            if (Object.keys(extensions).length > 0) {
              formatted.extensions = extensions;
            }
          }

          return formatted;
        });

        setResult({
          ...result,
          errors: formattedErrors as typeof result.errors,
        });
      }
    },
  };
};
