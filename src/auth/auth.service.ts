import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/utils/services';
import { AuthEntity } from './entities';
import { UserEntity } from 'src/users/entities';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.fetchUser(username, password);

    return user;
  }

  async loginJwt(username: string, password: string): Promise<AuthEntity> {
    const user = await this.fetchUser(username, password);

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async getUserFromSession(session: any) {
    const user = await this.usersService.findOne(session.passport.user.id);

    if (!user) {
      throw new UnauthorizedException(`Session isn't valid`);
    }

    return user;
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

    delete user.password;
    delete user.deletedAt;
    delete user.isDeleted;

    return user;
  }
}
