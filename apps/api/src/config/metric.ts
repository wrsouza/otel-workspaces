import { metrics } from '@opentelemetry/api';

export const metric = metrics.getMeter('api-service', '0.0.1');
