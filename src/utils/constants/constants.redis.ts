import { ConfigService } from '@nestjs/config';

export const REDIS_HOST = (configService: ConfigService) => {
  return configService.get('REDIS_HOST') || '127.0.0.1';
};
export const REDIS_PORT = (configService: ConfigService) => {
  return parseInt(configService.get('REDIS_PORT')) || 6379;
};
export const REDIS_PREFIX = (configService: ConfigService) => {
  return configService.get('REDIS_PREFIX') || 'myapp';
};
