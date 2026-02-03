import type { GraphQLErrorResponse } from "../graphql";

export const isAuthorizationError = (error: unknown): boolean => {
  const err = error as { errors?: GraphQLErrorResponse[] };
  return (
    err?.errors?.some(
      (e) =>
        e.extensions?.code === "FORBIDDEN" ||
        e.extensions?.code === "UNAUTHENTICATED",
    ) ?? false
  );
};
