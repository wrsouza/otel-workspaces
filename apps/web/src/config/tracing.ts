import { trace } from "@opentelemetry/api";

export const tracer = trace.getTracer("web-service", "0.0.1");
