import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ManualPaymentService } from './manual-payment.service';
import { PaymentDto } from './payment.dto';
import { QueueService } from './queue.service';
import { RedisService } from './redis.service';
import { ResponsePaymentDto } from './response-payment.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly queueService: QueueService,
    private readonly redisService: RedisService,
    private readonly manualPaymentService: ManualPaymentService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async processPayment(body: PaymentDto): Promise<ResponsePaymentDto> {
    try {
      const order = this.getOrder(body);
      await this.redisService.connect();
      await this.redisService.set(
        `order:${body.orderId}`,
        JSON.stringify(order),
      );
      await this.redisService.disconnect();
      await this.queueService.send(body);
      return { status: order.status };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error processing payment');
    }
  }

  getOrder(body: PaymentDto) {
    const registerDate = new Date().toISOString();
    return {
      amount: body.amount,
      status: 'processing',
      createdAt: registerDate,
      updatedAt: registerDate,
    };
  }

  async getPaymentStatus(orderId: string): Promise<string> {
    try {
      await this.redisService.connect();
      const data = await this.redisService.get(`order:${orderId}`);
      await this.redisService.disconnect();
      if (data) {
        const { status } = JSON.parse(data) as { status: string };
        return status;
      } else {
        return 'Order not found';
      }
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error retrieving payment status');
    }
  }

  async manualProcessPayment(body: PaymentDto): Promise<ResponsePaymentDto> {
    try {
      const order = this.getOrder(body);
      await this.redisService.connect();
      await this.redisService.set(
        `order:${body.orderId}`,
        JSON.stringify(order),
      );
      await this.redisService.disconnect();
      return this.manualPaymentService.process(body);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error processing manual payment');
    }
  }
}
