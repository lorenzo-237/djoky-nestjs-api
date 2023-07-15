import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashService } from 'src/utils/services';

@Module({
  providers: [UsersService, HashService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
