import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Session,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  HttpException,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards';
import { Public } from 'src/utils/decorators';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { UserEntity } from 'src/users/entities';
import { Request, Response } from 'express';
import { SESSION_NAME } from 'src/utils/constants';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('ok')
  @HttpCode(HttpStatus.OK)
  isOk() {
    return { message: 'ok' };
  }

  @Public() // I think public isn't required but it's more intuitive with
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({ type: UserEntity })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginLocal(@Req() req: Request) {
    return req.user;
  }

  @Public()
  @Post('login/token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthEntity })
  async loginJwt(@Body() { username, password }: LoginDto) {
    return this.authService.loginJwt(username, password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async LogoutLocal(@Req() req: Request, @Res() res: Response) {
    req.logout(function (err) {
      if (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
      req.session.destroy((err) => {
        if (err) {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
        res.clearCookie(SESSION_NAME);
        res.redirect('/api/auth/ok');
      });
    });
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
