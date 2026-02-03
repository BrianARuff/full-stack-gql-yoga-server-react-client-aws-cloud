import type { GraphQLErrorResponse } from "../graphql";

export const extractErrorMessages = (error: unknown): string[] => {
  const err = error as any;

  // Apollo Client v4 stores errors directly on the error object
  if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    return err.errors.map((e: GraphQLErrorResponse) => e.message);
  }

  // Try to get errors from cause (Apollo Client v4 pattern)
  if (err?.cause?.result?.errors && Array.isArray(err.cause.result.errors)) {
    return err.cause.result.errors.map((e: GraphQLErrorResponse) => e.message);
  }

  // Try networkError.result.errors
  if (
    err?.networkError?.result?.errors &&
    Array.isArray(err.networkError.result.errors)
  ) {
    return err.networkError.result.errors.map(
      (e: GraphQLErrorResponse) => e.message,
    );
  }

  // Try graphQLErrors array directly
  if (
    err?.graphQLErrors &&
    Array.isArray(err.graphQLErrors) &&
    err.graphQLErrors.length > 0
  ) {
    return err.graphQLErrors.map((e: GraphQLErrorResponse) => e.message);
  }

  // Try result.errors
  if (err?.result?.errors && Array.isArray(err.result.errors)) {
    return err.result.errors.map((e: GraphQLErrorResponse) => e.message);
  }

  // Fallback to single message
  return [err?.message ?? "An unknown error occurred"];
};
