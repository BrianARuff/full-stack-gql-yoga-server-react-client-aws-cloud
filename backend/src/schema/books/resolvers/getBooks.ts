import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { GraphQLError, GraphQLFieldResolver } from "graphql";
import { Context } from "../../..";
import { DDB_TABLE_NAMES } from "../../../database";
import { Query } from "../../../types";

export const getBooks: GraphQLFieldResolver<any, any, any> = async (
  _parent: any,
  args: any,
  context: Context,
  _info: any,
): Promise<Query["getBooks"]> => {
  try {
    // single when ID provided
    if (args.id) {
      const result = await context.ddb.send(
        new QueryCommand({
          TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
          KeyConditionExpression: "#id = :id",
          ExpressionAttributeNames: { "#id": "id" },
          ExpressionAttributeValues: { ":id": args.id },
        }),
      );

      return (result.Items ?? []) as Query["getBooks"];
    }

    // all books when no ID provided
    const result = await context.ddb.send(
      new ScanCommand({
        TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
      }),
    );

    return (result.Items ?? []) as Query["getBooks"];
  } catch (error) {
    throw new GraphQLError("Failed to get books", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
