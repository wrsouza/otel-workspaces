import { metrics } from "@opentelemetry/api";

export const metric = metrics.getMeter("web-service", "0.0.1");
