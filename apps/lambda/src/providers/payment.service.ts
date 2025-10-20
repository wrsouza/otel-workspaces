import { RedisService } from "./redis.service";

export class PaymentService {
  constructor(private readonly redis: RedisService) {}

  async process(orderId: string): Promise<void> {
    await this.redis.connect();

    const order = await this.redis.get(`order:${orderId}`);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    const parsedOrder = JSON.parse(order);
    parsedOrder.status = "processed";

    await this.redis.set(`order:${orderId}`, JSON.stringify(parsedOrder));
    await this.redis.disconnect();
    console.log("payment processed:", parsedOrder);
  }
}
