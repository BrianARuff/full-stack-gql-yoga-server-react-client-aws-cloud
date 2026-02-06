import jwt, { JwtPayload } from "jsonwebtoken";
import { Context } from "..";
import { createAppError, getRequiredEnv } from "../utils";

interface CognitoToken extends JwtPayload {
  "cognito:groups"?: string[];
  "cognito:username"?: string;
  email?: string;
  sub?: string;
}

export const requireAdminGroup = (token: string): CognitoToken => {
  if (!token) {
    throw createAppError("Authorization token missing", {
      code: "UNAUTHENTICATED",
    });
  }

  let decodedToken: CognitoToken | null;

  try {
    decodedToken = jwt.decode(token) as CognitoToken | null;
  } catch {
    throw createAppError("Invalid token format", {
      code: "UNAUTHENTICATED",
    });
  }

  if (!decodedToken) {
    throw createAppError("Invalid token", {
      code: "UNAUTHENTICATED",
    });
  }

  // Check token expiration
  if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
    throw createAppError("Token expired", {
      code: "UNAUTHENTICATED",
    });
  }

  const userGroups = decodedToken["cognito:groups"] || [];
  const requiredGroup = getRequiredEnv(
    "AGQL_BE_AWS_COGNITO_USER_POOL_GROUP_NAME",
  );
  const isAdmin = userGroups.includes(requiredGroup);

  if (!isAdmin) {
    const errors = [
      createAppError("Admin privileges required", {
        code: "FORBIDDEN",
      }),
      createAppError(
        userGroups.length === 0
          ? "User is not assigned to any groups"
          : `User groups [${userGroups.join(", ")}] do not include required group`,
        {
          code: "FORBIDDEN",
        },
      ),
    ];

    throw new AggregateError(errors);
  }

  return decodedToken;
};

export const extractToken = (context: Context): string | undefined => {
  return context.request.headers.get("authorization")?.replace("Bearer ", "");
};
