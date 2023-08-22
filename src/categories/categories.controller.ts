import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryEntity, CategoryResponse } from './entities';
import { Roles } from 'src/utils/decorators';
import { Role } from 'src/utils/enums';
import { SessionPassport } from 'src/utils/types';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreatedResponse({ type: CategoryEntity })
  @Roles(Role.Admin, Role.Manager)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Session() session: SessionPassport,
  ) {
    if (!session?.passport?.user?.id) {
      throw new UnauthorizedException();
    }

    const userId = session.passport.user.id;
    return new CategoryEntity(
      await this.categoriesService.create(userId, createCategoryDto),
    );
  }

  @Get('all')
  @ApiOkResponse({ type: CategoryResponse })
  @Roles(Role.Admin, Role.Manager)
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return { count: categories.length, rows: categories };
  }

  @Get()
  @ApiOkResponse({ type: CategoryResponse })
  async findValidCategories() {
    const categories = await this.categoriesService.findAllValid();
    return { count: categories.length, rows: categories };
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new CategoryEntity(await this.categoriesService.findOne(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoryEntity })
  @Roles(Role.Admin, Role.Manager)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return new CategoryEntity(
      await this.categoriesService.update(id, updateCategoryDto),
    );
  }

  @Patch(':id/validate')
  @ApiOkResponse({ type: CategoryEntity })
  @Roles(Role.Admin, Role.Manager)
  async validateCategory(@Param('id', ParseIntPipe) id: number) {
    return new CategoryEntity(await this.categoriesService.validate(id));
  }

  @Patch(':id/pending')
  @ApiOkResponse({ type: CategoryEntity })
  @Roles(Role.Admin, Role.Manager)
  async pendingCategory(@Param('id', ParseIntPipe) id: number) {
    return new CategoryEntity(await this.categoriesService.pending(id));
  }

  @Delete(':id')
  @ApiOkResponse({ type: CategoryEntity })
  @Roles(Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new CategoryEntity(await this.categoriesService.remove(id));
  }
}
