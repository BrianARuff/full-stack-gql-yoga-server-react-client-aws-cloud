import { GraphQLError } from "graphql";

export const getRequiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new GraphQLError(`Missing required environment variable: ${key}`, {
      extensions: { code: "CONFIGURATION_ERROR" },
    });
  }
  return value;
};
