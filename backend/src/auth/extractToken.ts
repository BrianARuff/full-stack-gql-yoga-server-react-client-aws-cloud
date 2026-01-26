import { GraphQLError } from "graphql/error";
import jwt from "jsonwebtoken";
import { Context } from "..";
import { getRequiredEnv } from "../utils";

export const requireAdminGroup = (token: string) => {
  if (!token) {
    throw new GraphQLError("Authorization token missing", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const decodedToken = jwt.decode(token);
  //   @ts-ignore
  const userGroups = decodedToken["cognito:groups"] || [];
  const isAdmin = userGroups.includes(
    getRequiredEnv("AWS_COGNITO_USER_POOL_GROUP_NAME"),
  );

  if (!isAdmin) {
    throw new GraphQLError("Admin privileges required", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  return decodedToken; // Return decoded token for further use
};

export const extractToken = (context: Context) => {
  // @ts-ignore
  return context.request.headers.authorization?.replace("Bearer ", "");
};
