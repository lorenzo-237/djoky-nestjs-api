import { Module } from '@nestjs/common';
import { ExtService } from './ext.service';
import { ExtController } from './ext.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [ExtService],
  controllers: [ExtController],
})
export class ExtModule {}
