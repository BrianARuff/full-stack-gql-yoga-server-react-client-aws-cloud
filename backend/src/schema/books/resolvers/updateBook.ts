import {
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { GraphQLError, GraphQLFieldResolver } from "graphql";
import { Context } from "../../..";
import { DDB_TABLE_NAMES } from "../../../database";
import { Book, MutationUpdateBookArgs } from "../../../types";

export const updateBook: GraphQLFieldResolver<
  any,
  Context,
  MutationUpdateBookArgs
> = async (_parent: any, args, context, _info: any) => {
  try {
    const now = new Date().toISOString();
    const { id, title, author } = args.input as any;

    if (typeof title !== "string" && typeof author !== "string") {
      throw new GraphQLError("No fields to update", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const queryResult = await context.ddb.send(
      new QueryCommand({
        TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": id },
        Limit: 1,
      }),
    );

    if (!queryResult.Items || queryResult.Items.length === 0) {
      throw new GraphQLError("Book not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const existing = queryResult.Items[0] as Book;
    const nextTitle = typeof title === "string" ? title : existing.title;
    const nextAuthor = typeof author === "string" ? author : existing.author;

    if (nextTitle !== existing.title) {
      const newItem: Book = {
        ...existing,
        title: nextTitle,
        author: nextAuthor,
        updatedAt: now,
      };

      await context.ddb.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
                Item: newItem,
                ConditionExpression:
                  "attribute_not_exists(#id) AND attribute_not_exists(#title)",
                ExpressionAttributeNames: {
                  "#id": "id",
                  "#title": "title",
                },
              },
            },
            {
              Delete: {
                TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
                Key: { id: existing.id, title: existing.title },
              },
            },
          ],
        }),
      );

      return newItem;
    }

    const updateExpression: string[] = ["#updatedAt = :updatedAt"];
    const expressionAttributeNames: Record<string, string> = {
      "#updatedAt": "updatedAt",
    };
    const expressionAttributeValues: Record<string, any> = {
      ":updatedAt": now,
    };

    if (typeof author === "string") {
      updateExpression.push("#author = :author");
      expressionAttributeNames["#author"] = "author";
      expressionAttributeValues[":author"] = author;
    }

    const result = await context.ddb.send(
      new UpdateCommand({
        TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
        Key: { id: existing.id, title: existing.title },
        UpdateExpression: `SET ${updateExpression.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }),
    );

    return result.Attributes as Book;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Failed to update book", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        error,
      },
    });
  }
};
