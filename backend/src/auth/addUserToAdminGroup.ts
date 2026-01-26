import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { getRequiredEnv } from "../utils";

const cognitoClient = new CognitoIdentityProviderClient({
  region: getRequiredEnv("AWS_REGION"),
  credentials: {
    accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
  },
});

export const addUserToAdminGroup = async (username: string) => {
  const res = await cognitoClient.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: getRequiredEnv("AWS_COGNITO_USER_POOL_ID"),
      Username: username,
      GroupName: getRequiredEnv("AWS_COGNITO_USER_POOL_GROUP_NAME"),
    }),
  );

  if (res.$metadata.httpStatusCode !== 200) {
    console.error("Failed to add user to admin group", res);
    return false;
  }

  return true;
};
