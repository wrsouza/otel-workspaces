import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const options = {
  url: "http://localhost:4317",
  compression: CompressionAlgorithm.GZIP,
};

const metricExporter = new OTLPMetricExporter(options);
const traceExporter = new OTLPTraceExporter(options);
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 5000,
  exportTimeoutMillis: 5000,
});

const consoleExporter = new ConsoleLogRecordExporter();
const simpleLogRecordProcessor = new SimpleLogRecordProcessor(consoleExporter);
const logOptions = {
  url: "http://localhost:4318/v1/logs",
  compression: CompressionAlgorithm.GZIP,
};
const logExporter = new OTLPLogExporter(logOptions);
const batchLogRecordProcessor = new BatchLogRecordProcessor(logExporter);

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "web-service",
    [ATTR_SERVICE_VERSION]: "0.0.1",
  }),
  metricReaders: [metricReader],
  traceExporter,
  logRecordProcessors: [simpleLogRecordProcessor, batchLogRecordProcessor],
  instrumentations: [
    getNodeAutoInstrumentations({}),
    new RedisInstrumentation({}),
  ],
});

process.on("beforeExit", async () => {
  await sdk.shutdown();
});

sdk.start();

export {};
