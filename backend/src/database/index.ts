import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import "dotenv/config";
import { getRequiredEnv } from "../utils";

export const getDDBClient = () => {
  const ddbClient = new DynamoDBClient({
    region: getRequiredEnv("AGQL_BE_AWS_REGION") as string,
    credentials: {
      accessKeyId: getRequiredEnv("AGQL_BE_AWS_ACCESS_KEY_ID") as string,
      secretAccessKey: getRequiredEnv(
        "AGQL_BE_AWS_SECRET_ACCESS_KEY",
      ) as string,
    },
  });

  const ddb = DynamoDBDocumentClient.from(ddbClient);

  return ddb;
};

export const DDB_TABLE_NAMES = {
  BOOKS_TABLE: getRequiredEnv("AGQL_BE_AWS_DDB_BOOKS_TABLE") as string,
};
