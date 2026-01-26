import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GraphQLError, GraphQLFieldResolver } from "graphql";
import { Context } from "../../..";
import { DDB_TABLE_NAMES } from "../../../database";
import { MutationDeleteBookArgs } from "../../../types";

export const deleteBook: GraphQLFieldResolver<
  any,
  Context,
  MutationDeleteBookArgs
> = async (_parent, args, context): Promise<any> => {
  try {
    const queryResult = await context.ddb.send(
      new QueryCommand({
        TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": args.input.id },
        Limit: 2,
      }),
    );

    if (!queryResult.Items || queryResult.Items.length === 0) {
      throw new GraphQLError("Book not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (queryResult.Items.length > 1) {
      throw new GraphQLError("Multiple books found for id", {
        extensions: { code: "CONFLICT" },
      });
    }

    const deletedBook = queryResult.Items[0] as any;

    await context.ddb.send(
      new DeleteCommand({
        TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
        Key: { id: deletedBook.id, title: deletedBook.title },
      }),
    );

    return deletedBook;
  } catch (error) {
    throw new GraphQLError("Failed to delete book", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
