import { Injectable } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createExerciseDto: CreateExerciseDto) {
    const data = {
      createdUserId: userId,
      ...createExerciseDto,
    };

    return this.prisma.exercise.create({
      data: data,
    });
  }

  findAll() {
    return this.prisma.exercise.findMany();
  }

  findOne(id: number) {
    return this.prisma.exercise.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  remove(id: number) {
    return this.prisma.exercise.delete({ where: { id } });
  }
}
