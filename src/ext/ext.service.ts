import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExtService {
  constructor(private userService: UsersService) {}

  findAllUsers() {
    return this.userService.findAll();
  }
}
