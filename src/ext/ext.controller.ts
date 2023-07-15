import { Controller, Get, UseGuards } from '@nestjs/common';
import { ExtService } from './ext.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities';

@Controller('ext')
@ApiTags('JWT Access')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class ExtController {
  constructor(private extService: ExtService) {}

  @Get('users')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAllUsers() {
    const users = await this.extService.findAllUsers();
    return users.map((user) => new UserEntity(user));
  }
}
