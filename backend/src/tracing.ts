import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { getRequiredEnv } from "./utils";

const isProduction = getRequiredEnv("AGQL_BE_NODE_ENV") === "production";

const sdk = new NodeSDK({
  serviceName: "graphql-yoga-server",
  traceExporter: isProduction ? undefined : new ConsoleSpanExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on("SIGTERM", () => {
  sdk.shutdown().finally(() => process.exit(0));
});
