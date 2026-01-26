import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import "dotenv/config";
import { getRequiredEnv } from "../utils";

export const getDDBClient = () => {
  const ddbClient = new DynamoDBClient({
    region: getRequiredEnv("AWS_REGION") as string,
    credentials: {
      accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID") as string,
      secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY") as string,
    },
  });

  const ddb = DynamoDBDocumentClient.from(ddbClient);

  return ddb;
};

export const DDB_TABLE_NAMES = {
  BOOKS_TABLE: getRequiredEnv("AWS_DDB_BOOKS_TABLE") as string,
};
