import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createCategoryDto: CreateCategoryDto) {
    const data = {
      createdUserId: userId,
      ...createCategoryDto,
    };

    return this.prisma.category.create({
      data: data,
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  findAllValid() {
    return this.prisma.category.findMany({
      where: {
        isPending: false,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  validate(id: number) {
    return this.prisma.category.update({
      where: { id },
      data: {
        isPending: false,
      },
    });
  }

  pending(id: number) {
    return this.prisma.category.update({
      where: { id },
      data: {
        isPending: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
