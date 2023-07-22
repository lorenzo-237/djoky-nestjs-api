import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Req,
  Session,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards';
import { Public } from 'src/utils/decorators';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { UserEntity } from 'src/users/entities';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // I think public isn't required but it's more intuitive with
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({ type: UserEntity })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginLocal(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('login/token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthEntity })
  async loginJwt(@Body() { username, password }: LoginDto) {
    return this.authService.loginJwt(username, password);
  }

  @Get('session')
  @ApiOkResponse({ type: UserEntity })
  async getAuthSession(@Session() session: Record<string, any>) {
    const user = await this.authService.getUserFromSession(session);
    return new UserEntity(user);
  }

  @Get('status')
  async getAuthStatus(@Req() req: any) {
    return req.user;
  }
}
