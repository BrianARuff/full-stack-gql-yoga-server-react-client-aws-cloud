import { ASTNode } from "graphql";
import { createGraphQLError } from "graphql-yoga";

export type AppErrorCode =
  | "BAD_USER_INPUT"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "CONFIGURATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

type CreateAppErrorOptions = {
  code: AppErrorCode;
  details?: Record<string, unknown>;
  nodes?: ASTNode | ASTNode[] | null;
  path?: ReadonlyArray<string | number>;
};

export const createAppError = (
  message: string,
  { code, details, nodes, path }: CreateAppErrorOptions,
) => {
  return createGraphQLError(message, {
    extensions: {
      code,
      ...(details && { details }),
    },
    ...(nodes && { nodes }),
    ...(path && { path }),
  });
};
