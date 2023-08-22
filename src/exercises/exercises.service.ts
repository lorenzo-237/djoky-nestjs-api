import { Injectable } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PrismaService } from 'nestjs-prisma';

const defaultSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  isPending: true,
  group: {
    select: {
      id: true,
      name: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createExerciseDto: CreateExerciseDto) {
    const data = {
      createdUserId: userId,
      ...createExerciseDto,
    };

    const createdExercise = await this.prisma.exercise.create({
      data: data,
    });

    return this.findOne(createdExercise.id);
  }

  findAll() {
    return this.prisma.exercise.findMany({
      orderBy: {
        name: 'asc',
      },
      select: defaultSelect,
    });
  }

  findAllValid() {
    return this.prisma.exercise.findMany({
      where: {
        isPending: false,
      },
      orderBy: {
        name: 'asc',
      },
      select: defaultSelect,
    });
  }

  findOne(id: number) {
    return this.prisma.exercise.findUnique({
      select: defaultSelect,
      where: {
        id,
      },
    });
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    const updatedExercise = await this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
    return this.findOne(updatedExercise.id);
  }

  async validate(id: number) {
    const updatedExercise = await this.prisma.exercise.update({
      where: { id },
      data: {
        isPending: false,
      },
    });
    return this.findOne(updatedExercise.id);
  }

  async pending(id: number) {
    const updatedExercise = await this.prisma.exercise.update({
      where: { id },
      data: {
        isPending: true,
      },
    });
    return this.findOne(updatedExercise.id);
  }

  remove(id: number) {
    return this.prisma.exercise.delete({ where: { id } });
  }
}
