import { Plugin, YogaInitialContext } from "graphql-yoga";
import { Context } from "..";
import { useRequireAdminGroup } from "./useRequireAdminGroup";

export const plugins:
  | ({} | Plugin | Plugin<Context & YogaInitialContext>)[]
  | undefined = [useRequireAdminGroup()];
