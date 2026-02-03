import { createAppError } from "./createAppError";

export const getRequiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw createAppError(`Missing required environment variable: ${key}`, {
      code: "CONFIGURATION_ERROR",
    });
  }
  return value;
};
