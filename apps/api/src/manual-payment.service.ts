import { Injectable } from '@nestjs/common';
import { PaymentDto } from './payment.dto';
import { ResponsePaymentDto } from './response-payment.dto';

@Injectable()
export class ManualPaymentService {
  async process(body: PaymentDto): Promise<ResponsePaymentDto> {
    const response = await fetch('http://localhost:4002/manual-process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return (await response.json()) as ResponsePaymentDto;
  }
}
