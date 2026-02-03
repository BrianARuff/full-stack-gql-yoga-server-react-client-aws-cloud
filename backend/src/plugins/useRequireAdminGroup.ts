import { DefinitionNode, GraphQLError, OperationDefinitionNode } from "graphql";
import { Plugin } from "graphql-yoga";
import { Context } from "..";
import { requireAdminGroup } from "../auth/extractToken";
import { AppErrorCode, createAppError } from "../utils";

const globallyAllowedOperations: Record<string, boolean> = {
  GetIntroductionMessage: true,
  CreateAdminUser: true,
};

export const useRequireAdminGroup = (): Plugin<Context> => {
  return {
    onExecute({ context, args, setResultAndStopExecution }) {
      if (globallyAllowedOperations[args.operationName || ""]) {
        return;
      }

      const token =
        context.request.headers.get("authorization")?.replace("Bearer ", "") ||
        "";

      try {
        requireAdminGroup(token);
      } catch (error) {
        // Get operation node and root field for path/location
        const operationNode = args.document?.definitions?.find(
          (def: DefinitionNode): def is OperationDefinitionNode =>
            def.kind === "OperationDefinition",
        );
        const rootFieldName =
          operationNode?.selectionSet?.selections?.[0]?.kind === "Field"
            ? operationNode.selectionSet.selections[0].name.value
            : undefined;

        // Handle multiple errors (AggregateError)
        if (error instanceof AggregateError) {
          const enrichedErrors = error.errors.map((err: GraphQLError) =>
            createAppError(err.message, {
              code:
                (err.extensions?.code as AppErrorCode) ||
                "INTERNAL_SERVER_ERROR",
              nodes: operationNode,
              path: rootFieldName ? [rootFieldName] : undefined,
            }),
          );

          // Use setResultAndStopExecution to return errors properly
          setResultAndStopExecution({
            data: null,
            errors: enrichedErrors,
          });
          return;
        }

        if (error instanceof GraphQLError) {
          setResultAndStopExecution({
            data: null,
            errors: [
              createAppError(error.message, {
                code:
                  (error.extensions?.code as AppErrorCode) ||
                  "INTERNAL_SERVER_ERROR",
                nodes: operationNode,
                path: rootFieldName ? [rootFieldName] : undefined,
              }),
            ],
          });
          return;
        }

        throw error;
      }
    },
  };
};
