import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'nestjs-prisma';
import { GroupRow } from './entities';

const defaultSelect = {
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
  exercises: {
    select: {
      id: true,
    },
  },
};
@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createGroupDto: CreateGroupDto) {
    const data = {
      createdUserId: userId,
      ...createGroupDto,
    };

    const createdGroup = await this.prisma.group.create({
      data: data,
    });
    return this.findOne(createdGroup.id);
  }

  async findAll() {
    const groups = await this.prisma.group.findMany({
      orderBy: {
        name: 'asc',
      },
      select: defaultSelect,
    });

    const groupsWithExerciseCount: GroupRow[] = groups.map((group) => ({
      ...group,
      exercisesCount: group.exercises.length,
      exercises: undefined,
    }));

    return groupsWithExerciseCount;
  }

  findOne(id: number) {
    return this.prisma.group.findUnique({
      select: defaultSelect,
      where: {
        id,
      },
    });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const updatedGroup = await this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
    return this.findOne(updatedGroup.id);
  }

  async validate(id: number) {
    const updatedGroup = await this.prisma.group.update({
      where: { id },
      data: {
        isPending: false,
      },
    });
    return this.findOne(updatedGroup.id);
  }

  async pending(id: number) {
    const updatedGroup = await this.prisma.group.update({
      where: { id },
      data: {
        isPending: true,
      },
    });
    return this.findOne(updatedGroup.id);
  }

  remove(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }
}
