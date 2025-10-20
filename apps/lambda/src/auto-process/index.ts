import type { Context, SQSEvent, SQSHandler, SQSRecord } from "aws-lambda";
import "dotenv/config";
import { RedisService } from "../providers";
import { PaymentService } from "../providers/payment.service";

export const handler: SQSHandler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  const results = [];
  try {
    for (const message of event.Records) {
      const result = await processMessageAsync(message);
      results.push(result);
    }
    console.log(results);
  } catch (err) {
    console.error(err);
  }
};

const processMessageAsync = async (
  message: SQSRecord
): Promise<{ success: boolean }> => {
  try {
    console.log("processing payment:", message.body);
    const { orderId } = JSON.parse(message.body);
    const paymentService = new PaymentService(new RedisService());
    await paymentService.process(orderId);
    return { success: true };
  } catch (err) {
    console.error("error processing:", err);
    throw err;
  }
};
