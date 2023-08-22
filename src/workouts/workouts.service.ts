import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PrismaService } from 'nestjs-prisma';
import { selectDefaultWorkout } from './constants';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createWorkoutDto: CreateWorkoutDto) {
    const data = {
      userId: userId,
      ...createWorkoutDto,
    };
    // transform the valid date string to a date object to insert it, into postgresql
    data.date = new Date(createWorkoutDto.date);

    const createdWorkout = await this.prisma.workout.create({
      data: data,
    });

    return createdWorkout;
  }

  findAll(userId: number, admin: boolean) {
    return this.prisma.workout.findMany({
      select: selectDefaultWorkout,
      where: {
        isDeleted: admin ? undefined : false,
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.workout.findUnique({
      select: selectDefaultWorkout,
      where: {
        id,
        userId,
      },
    });
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    const updatedWorkout = await this.prisma.workout.update({
      where: { id },
      data: updateWorkoutDto,
    });
    return this.findOne(updatedWorkout.id, updatedWorkout.userId);
  }

  async remove(id: number) {
    const updatedWorkout = await this.prisma.workout.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });
    return this.findOne(updatedWorkout.id, updatedWorkout.userId);
  }
}
