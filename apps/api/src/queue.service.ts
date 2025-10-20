import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentDto } from './payment.dto';

@Injectable()
export class QueueService {
  private client: SQSClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new SQSClient({
      region: this.configService.get('AWS_REGION'),
      ...(this.configService.get('AWS_ENDPOINT')
        ? {
            endpoint: this.configService.get('AWS_ENDPOINT'),
            credentials: { accessKeyId: 'na', secretAccessKey: 'na' },
          }
        : {}),
    });
  }

  async send(payload: PaymentDto): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: this.configService.get('AWS_QUEUE_URL'),
      MessageBody: JSON.stringify(payload),
    });
    try {
      const data = await this.client.send(command);
      console.log('Success, message sent. MessageID:', data.MessageId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
