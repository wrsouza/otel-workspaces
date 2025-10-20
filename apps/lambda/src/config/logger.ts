import {
  Logger as LoggerOtel,
  logs,
  SeverityNumber,
} from "@opentelemetry/api-logs";

export default class Logger {
  private readonly logger: LoggerOtel;
  private readonly context: string;

  constructor(context: string = "default") {
    this.context = context;
    this.logger = logs.getLogger("lambda-service", "0.0.1");
  }

  info(message: string, data = {}) {
    this.logger.emit({
      severityText: SeverityNumber.INFO.toString(),
      body: message,
      attributes: {
        context: this.context,
        ...data,
      },
    });
  }

  error(message: string, data = {}) {
    this.logger.emit({
      severityText: SeverityNumber.ERROR.toString(),
      body: message,
      attributes: {
        context: this.context,
        ...data,
      },
    });
  }

  debug(message: string, data = {}) {
    this.logger.emit({
      severityText: SeverityNumber.DEBUG.toString(),
      body: message,
      attributes: {
        context: this.context,
        ...data,
      },
    });
  }

  warn(message: string, data = {}) {
    this.logger.emit({
      severityText: SeverityNumber.WARN.toString(),
      body: message,
      attributes: {
        context: this.context,
        ...data,
      },
    });
  }
}
