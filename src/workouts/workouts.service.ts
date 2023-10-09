import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PrismaService } from 'nestjs-prisma';
import { selectDefaultWorkout } from './constants';

type FilterWhere = {
  isDeleted?: boolean;
  userId: number;
  date?: {
    gte?: Date;
    lte?: Date;
  };
};

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

    return this.findOne(createdWorkout.id);
  }

  async findAll({
    userId,
    admin,
    startDate,
    endDate,
    page,
    pageSize,
  }: {
    userId: number;
    admin: boolean;
    startDate: Date | undefined;
    endDate: Date | undefined;
    page: number;
    pageSize: number;
  }) {
    const where: FilterWhere = {
      isDeleted: admin ? undefined : false,
      userId: userId,
    };

    if (startDate != undefined) {
      where.date = {
        gte: startDate,
      };
    }

    if (endDate != undefined) {
      if (!where.date) {
        where.date = {};
      }
      where.date.lte = endDate;
    }

    const skip = (page - 1) * pageSize;

    const workoutsDb = await this.prisma.workout.findMany({
      select: selectDefaultWorkout,
      where,
      skip,
      take: pageSize,
      orderBy: {
        date: 'desc',
      },
    });

    const totalCount = await this.prisma.workout.count({
      where,
    });

    return {
      count: totalCount,
      totalPage: Math.ceil(totalCount / pageSize), // plus petit entier supérieur
      workoutsDb,
    };
  }

  findOne(id: number) {
    return this.prisma.workout.findUnique({
      select: selectDefaultWorkout,
      where: {
        id,
      },
    });
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    const updatedWorkout = await this.prisma.workout.update({
      where: { id },
      data: updateWorkoutDto,
    });
    return this.findOne(updatedWorkout.id);
  }

  async remove(id: number) {
    const updatedWorkout = await this.prisma.workout.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });
    return this.findOne(updatedWorkout.id);
  }
}
