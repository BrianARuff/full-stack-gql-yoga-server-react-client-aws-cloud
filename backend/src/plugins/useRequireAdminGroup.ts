import { Plugin } from "graphql-yoga";
import { Context } from "..";
import { requireAdminGroup } from "../auth/extractToken";

const globallyAllowedOperations: Record<string, boolean> = {
  GetIntroductionMessage: true,
  CreateAdminUser: true,
};

export const useRequireAdminGroup = (): Plugin<Context> => {
  return {
    onExecute({ context, args }) {
      if (globallyAllowedOperations[args.operationName || ""]) {
        return;
      }

      const token =
        context.request.headers.get("authorization")?.replace("Bearer ", "") ||
        "";

      requireAdminGroup(token);
    },
  };
};
