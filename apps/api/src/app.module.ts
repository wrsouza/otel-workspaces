import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManualPaymentService } from './manual-payment.service';
import { QueueService } from './queue.service';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, QueueService, RedisService, ManualPaymentService],
})
export class AppModule {}
