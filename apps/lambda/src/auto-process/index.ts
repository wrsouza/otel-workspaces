import "dotenv/config";
import "../config/otel";

import type { Context, SQSEvent, SQSHandler, SQSRecord } from "aws-lambda";
import Logger from "../config/logger";
import { RedisService } from "../providers";
import { PaymentService } from "../providers/payment.service";

export const handler: SQSHandler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  const logger = new Logger(`SQSHandler`);
  const results = [];
  try {
    for (const message of event.Records) {
      const result = await processMessageAsync(message);
      results.push(result);
    }
    logger.info("success process", { results });
  } catch (err: any) {
    logger.error("error process", { message: err.message, stack: err.stack });
  }
};

const processMessageAsync = async (
  message: SQSRecord
): Promise<{ success: boolean }> => {
  const logger = new Logger(`processMessageAsync`);
  try {
    logger.info("processing payment:", { body: message.body });
    const { orderId } = JSON.parse(message.body);
    const paymentService = new PaymentService(new RedisService());
    await paymentService.process(orderId);
    return { success: true };
  } catch (err: any) {
    logger.error("error processing:", {
      message: err.message,
      stack: err.stack,
    });
    throw err;
  }
};
