import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { GraphQLError, GraphQLFieldResolver } from "graphql";
import { Context } from "../../..";
import { DDB_TABLE_NAMES } from "../../../database";
import { createAppError } from "../../../utils";
import { GetBooksData } from "../types";

export const getBooks: GraphQLFieldResolver<any, Context, any> = async (
  _parent,
  args,
  context,
  _info,
): Promise<GetBooksData["getBooks"]> => {
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

      return (result.Items ?? []) as GetBooksData["getBooks"];
    }

    // all books when no ID provided
    const result = await context.ddb.send(
      new ScanCommand({
        TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
      }),
    );

    return (result.Items ?? []) as GetBooksData["getBooks"];
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw createAppError("Failed to get books", {
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
