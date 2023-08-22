import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createGroupDto: CreateGroupDto) {
    const data = {
      createdUserId: userId,
      ...createGroupDto,
    };

    return this.prisma.group.create({
      data: data,
    });
  }

  findAll() {
    return this.prisma.group.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        createdUserId: true,
        isPending: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  findAllValid() {
    return this.prisma.group.findMany({
      where: {
        isPending: false,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        createdUserId: true,
        isPending: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.group.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  remove(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }
}
