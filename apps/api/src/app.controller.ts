import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { PaymentDto } from './payment.dto';
import { ResponsePaymentDto } from './response-payment.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/process-payments')
  handlePayment(@Body() body: PaymentDto): Promise<ResponsePaymentDto> {
    return this.appService.processPayment(body);
  }

  @Sse('/payment-status/:id')
  sse(@Param('id') id: string): Observable<MessageEvent> {
    return new Observable<MessageEvent>((observer) => {
      const intervalId = setInterval(() => {
        this.appService.getPaymentStatus(id).then((status) => {
          observer.next({ data: JSON.stringify({ status }) } as MessageEvent);
          if (status !== 'processing') {
            clearInterval(intervalId);
            observer.complete();
          }
        });
      }, 1000);
      return () => clearInterval(intervalId);
    });
  }

  @Post('/manual-payments')
  manualPayment(@Body() body: PaymentDto): Promise<ResponsePaymentDto> {
    return new Promise((resolve) =>
      setTimeout(
        () => {
          resolve(this.appService.manualProcessPayment(body));
        },
        randomInt(100, 3000),
      ),
    );
  }
}
