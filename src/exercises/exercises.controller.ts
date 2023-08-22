import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExerciseRow, ExerciseResponse } from './entities';
import { SessionPassport } from 'src/utils/types';
import { Roles } from 'src/utils/decorators';
import { Role } from 'src/utils/enums';

@Controller('exercises')
@ApiTags('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @ApiCreatedResponse({ type: ExerciseRow })
  @Roles(Role.Admin, Role.Manager)
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
    @Session() session: SessionPassport,
  ) {
    if (!session.passport.user.id) {
      throw new UnauthorizedException();
    }

    const userId = session.passport.user.id;

    return await this.exercisesService.create(userId, createExerciseDto);
  }

  @Get('all')
  @ApiOkResponse({ type: ExerciseResponse })
  @Roles(Role.Admin, Role.Manager)
  async findAll() {
    const exercises = await this.exercisesService.findAll();
    return { count: exercises.length, rows: exercises };
  }

  @Get()
  @ApiOkResponse({ type: ExerciseResponse })
  async findValidExercises() {
    const exercises = await this.exercisesService.findAllValid();
    return { count: exercises.length, rows: exercises };
  }

  @Get(':id')
  @ApiOkResponse({ type: ExerciseRow })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.exercisesService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ExerciseRow })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return await this.exercisesService.update(id, updateExerciseDto);
  }

  @Patch(':id/validate')
  @ApiOkResponse({ type: ExerciseRow })
  @Roles(Role.Admin, Role.Manager)
  async validateCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.exercisesService.validate(id);
  }

  @Patch(':id/pending')
  @ApiOkResponse({ type: ExerciseRow })
  @Roles(Role.Admin, Role.Manager)
  async pendingCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.exercisesService.pending(id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ExerciseRow })
  @Roles(Role.Admin)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.exercisesService.remove(id);
  }
}
