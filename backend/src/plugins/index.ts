import { useOpenTelemetry } from "@envelop/opentelemetry";
import { Plugin, YogaInitialContext } from "graphql-yoga";
import { Context } from "..";
import { getRequiredEnv } from "../utils";
import { useErrorFormatter } from "./useErrorFormatter";
import { useRequireAdminGroup } from "./useRequireAdminGroup";
import { useTracingExtensions } from "./useTracingExtensions";

const isProduction = getRequiredEnv("AGQL_BE_NODE_ENV") === "production";

export const plugins:
  | ({} | Plugin | Plugin<Context & YogaInitialContext>)[]
  | undefined = [
  useRequireAdminGroup(),
  useErrorFormatter(),
  useTracingExtensions(),
  ...(!isProduction
    ? [
        useOpenTelemetry({
          resolvers: true,
          variables: true,
          result: true,
        }),
      ]
    : []),
];
