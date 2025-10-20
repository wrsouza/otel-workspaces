import { trace } from "@opentelemetry/api";

export const tracer = trace.getTracer("lambda-service", "0.0.1");
