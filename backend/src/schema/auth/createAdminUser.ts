import { Context } from "../..";
import { addUserToAdminGroup } from "../../auth/addUserToAdminGroup";
import { createAppError } from "../../utils";

export const createAdminUser = (
  _parent: any,
  args: { username: string },
  _context: Context,
  _info: any,
) => {
  if (!args?.username?.trim?.()) {
    throw createAppError("Username is required", {
      code: "BAD_USER_INPUT",
    });
  }

  return addUserToAdminGroup(args.username);
};
