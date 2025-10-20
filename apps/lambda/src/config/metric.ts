import { metrics } from "@opentelemetry/api";

export const metric = metrics.getMeter("lambda-service", "0.0.1");
