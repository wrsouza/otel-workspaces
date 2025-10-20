import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import "dotenv/config";
import { RedisService } from "../providers";
import { PaymentService } from "../providers/payment.service";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { orderId, amount } = body;
    const paymentService = new PaymentService(new RedisService());
    await paymentService.process(orderId);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "processed" }),
    };
  } catch (err: unknown) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
