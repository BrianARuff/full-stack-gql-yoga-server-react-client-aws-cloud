import { GraphQLError } from "graphql/error";
import { Context } from "../..";
import { addUserToAdminGroup } from "../../auth/addUserToAdminGroup";

export const createAdminUserTypeDefs = `
    type Mutation {
        createAdminUser(username: String!): Boolean!
    }
`;

export const createAdminUser = (
  _parent: any,
  args: { username: string },
  context: Context,
  _info: any,
) => {
  if (!args?.username?.trim?.()) {
    throw new GraphQLError("Username is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  return addUserToAdminGroup(args.username);
};
