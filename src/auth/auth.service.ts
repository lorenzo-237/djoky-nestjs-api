import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/utils/services';
import { AuthEntity } from './entities';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.fetchUser(username, password);

    return user;
  }

  async loginJwt(username: string, password: string): Promise<AuthEntity> {
    const user = await this.fetchUser(username, password);

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async fetchUser(username: string, password: string) {
    const user = await this.usersService.fetchUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const matched = this.hashService.comparePasswords(password, user.password);

    if (!matched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
