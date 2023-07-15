import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto, UpdateUserDto } from './dto';
import { HashService } from 'src/utils/services';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private hash: HashService) {}

  create(createUserDto: CreateUserDto) {
    const passwordHash = this.hash.encodePassword(createUserDto.password);

    return this.prisma.user.create({
      data: { ...createUserDto, password: passwordHash },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async fetchUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }
}
