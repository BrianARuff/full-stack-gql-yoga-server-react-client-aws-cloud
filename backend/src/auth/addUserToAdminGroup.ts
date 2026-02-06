import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { getRequiredEnv } from "../utils";

const cognitoClient = new CognitoIdentityProviderClient({
  region: getRequiredEnv("AGQL_BE_AWS_REGION"),
  credentials: {
    accessKeyId: getRequiredEnv("AGQL_BE_AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("AGQL_BE_AWS_SECRET_ACCESS_KEY"),
  },
});

export const addUserToAdminGroup = async (username: string) => {
  const res = await cognitoClient.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: getRequiredEnv("AGQL_BE_AWS_COGNITO_USER_POOL_ID"),
      Username: username,
      GroupName: getRequiredEnv("AGQL_BE_AWS_COGNITO_USER_POOL_GROUP_NAME"),
    }),
  );

  if (res.$metadata.httpStatusCode !== 200) {
    console.error("Failed to add user to admin group", res);
    return false;
  }

  return true;
};
