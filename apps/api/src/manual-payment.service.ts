import { Injectable } from '@nestjs/common';
import { tracer } from './config';
import { PaymentDto } from './payment.dto';
import { ResponsePaymentDto } from './response-payment.dto';

@Injectable()
export class ManualPaymentService {
  async process(body: PaymentDto): Promise<ResponsePaymentDto> {
    return tracer.startActiveSpan(
      'ManualPaymentService.process',
      async (span) => {
        try {
          const response = await fetch('http://localhost:4002/manual-process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          const result = (await response.json()) as ResponsePaymentDto;
          return result;
        } catch (err) {
          span.recordException(err as Error);
          throw err;
        } finally {
          span.end();
        }
      },
    );
  }
}
