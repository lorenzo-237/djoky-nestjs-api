import { ConfigService } from '@nestjs/config';
import RedisStore from 'connect-redis';
import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

export const REDIS_HOST = (configService: ConfigService): string => {
  return configService.get('REDIS_HOST') || '127.0.0.1';
};
export const REDIS_PORT = (configService: ConfigService): number => {
  return parseInt(configService.get('REDIS_PORT')) || 6379;
};
export const REDIS_PREFIX = (configService: ConfigService): string => {
  return configService.get('REDIS_PREFIX') || 'myapp';
};

class MyRedis {
  host: string;
  port: number;
  prefix: string;
  client?: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  async initialize(env: ConfigService) {
    this.host = REDIS_HOST(env);
    this.port = REDIS_PORT(env);
    this.prefix = REDIS_PREFIX(env);

    this.client = createClient({
      socket: {
        host: this.host,
        port: this.port,
      },
    });

    try {
      await this.client.connect();
      console.log(
        '\x1b[36m%s\x1b[0m',
        `[SESSION] Connected to redis [${this.host}:${this.port}] Prefix is ${this.prefix}`,
      );
      return this.client;
    } catch (err) {
      throw err;
    }
  }

  getStore() {
    return new RedisStore({
      client: this.client,
      prefix: `${this.prefix}:`,
    });
  }
}

export default new MyRedis();
