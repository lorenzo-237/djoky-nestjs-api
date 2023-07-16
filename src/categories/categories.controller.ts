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
import { CategoryEntity } from './entities';
import { Public } from 'src/utils/decorators';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({ type: CategoryEntity })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Session() session: Record<string, any>,
  ) {
    if (!session?.passport?.user?.id) {
      throw new UnauthorizedException();
    }

    const userId = session.passport.user.id;
    return new CategoryEntity(
      await this.categoriesService.create(userId, createCategoryDto),
    );
  }

  @Public()
  @Get()
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return categories.map((category) => new CategoryEntity(category));
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: CategoryEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new CategoryEntity(await this.categoriesService.findOne(id));
  }

  @Public()
  @Patch(':id')
  @ApiCreatedResponse({ type: CategoryEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return new CategoryEntity(
      await this.categoriesService.update(id, updateCategoryDto),
    );
  }

  @Public()
  @Delete(':id')
  @ApiOkResponse({ type: CategoryEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new CategoryEntity(await this.categoriesService.remove(id));
  }
}
