import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { tracer } from './config';

@Injectable()
export class RedisService {
  private readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get<string>('REDIS_URL'),
    });
  }

  async connect(): Promise<void> {
    return tracer.startActiveSpan('RedisService.connect', async (span) => {
      await this.client.connect();
      span.end();
    });
  }

  async disconnect(): Promise<void> {
    return tracer.startActiveSpan('RedisService.disconnect', async (span) => {
      await this.client.quit();
      span.end();
    });
  }

  async set(key: string, value: string): Promise<void> {
    return tracer.startActiveSpan('RedisService.set', async (span) => {
      await this.client.set(key, value);
      span.end();
    });
  }

  async get(key: string): Promise<string | null> {
    return tracer.startActiveSpan('RedisService.get', async (span) => {
      const value = await this.client.get(key);
      span.end();
      return value;
    });
  }
}
