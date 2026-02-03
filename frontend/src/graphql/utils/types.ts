export type GraphQLErrorType = {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

export type ApolloErrorLike = {
  message: string;
  graphQLErrors?: GraphQLErrorType[];
  networkError?: Error | null;
};

export type GraphQLErrorResponse = {
  message: string;
  extensions?: Record<string, unknown>;
};

export type ErrorMessageProps = {
  message: string | string[];
  className?: string;
  title?: string;
};
