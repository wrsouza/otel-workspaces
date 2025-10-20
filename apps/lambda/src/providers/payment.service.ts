import { tracer } from "../config";
import Logger from "../config/logger";
import { RedisService } from "./redis.service";

export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly redis: RedisService) {}

  async process(orderId: string): Promise<void> {
    return tracer.startActiveSpan("PaymentService.process", async (span) => {
      await this.redis.connect();

      const order = await this.redis.get(`order:${orderId}`);
      if (!order) {
        this.logger.error("Order not found", { orderId });
        throw new Error(`Order with ID ${orderId} not found`);
      }
      const parsedOrder = JSON.parse(order);
      parsedOrder.status = "processed";

      await this.redis.set(`order:${orderId}`, JSON.stringify(parsedOrder));
      await this.redis.disconnect();
      this.logger.info("payment processed:", parsedOrder);
      span.end();
    });
  }
}
