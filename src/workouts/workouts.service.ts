import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createWorkoutDto: CreateWorkoutDto) {
    const data = {
      userId: userId,
      ...createWorkoutDto,
    };

    return this.prisma.workout.create({
      data: data,
    });
  }

  findAll() {
    return this.prisma.workout.findMany({
      where: {
        isDeleted: false,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.workout.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    return this.prisma.workout.update({
      where: { id },
      data: updateWorkoutDto,
    });
  }

  remove(id: number) {
    return this.prisma.workout.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });
  }
}
