import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { GraphQLError, GraphQLFieldResolver } from "graphql";
import { v4 as uuid } from "uuid";
import { Context } from "../../..";
import { DDB_TABLE_NAMES } from "../../../database";
import { createAppError } from "../../../utils";
import { Book, MutationCreateBookArgs } from "../types";

export const createBook: GraphQLFieldResolver<
  any,
  Context,
  MutationCreateBookArgs
> = async (_parent, args, context, info): Promise<Book> => {
  try {
    const now = new Date().toISOString();

    const newBook: Book = {
      id: uuid(),
      title: args.input.title,
      author: args.input.author,
      createdAt: now,
      updatedAt: now,
    };

    await context.ddb.send(
      new PutCommand({
        TableName: DDB_TABLE_NAMES.BOOKS_TABLE,
        Item: newBook,
        ConditionExpression: "attribute_not_exists(#id)",
        ExpressionAttributeNames: {
          "#id": "id",
        },
      }),
    );

    return newBook;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw createAppError("Failed to create book", {
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
