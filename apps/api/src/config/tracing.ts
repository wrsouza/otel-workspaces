import { trace } from '@opentelemetry/api';

export const tracer = trace.getTracer('api-service', '0.0.1');
