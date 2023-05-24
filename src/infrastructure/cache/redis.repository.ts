import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheRepository } from '../../domain/ports/cache.repository.interface';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

@Injectable()
export class RedisRepository implements CacheRepository {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    dotenv.config();
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
    });
  }

  async get(key: string): Promise<any | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
