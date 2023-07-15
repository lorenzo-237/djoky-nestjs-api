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
import { ExerciseEntity } from './entities';

@Controller('exercises')
@ApiTags('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @ApiCreatedResponse({ type: ExerciseEntity })
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
    @Session() session: Record<string, any>,
  ) {
    if (!session?.passport?.user?.id) {
      throw new UnauthorizedException();
    }

    const userId = session.passport.user.id;

    return new ExerciseEntity(
      await this.exercisesService.create(userId, createExerciseDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: ExerciseEntity, isArray: true })
  async findAll() {
    const exercises = await this.exercisesService.findAll();
    return exercises.map((exercise) => new ExerciseEntity(exercise));
  }

  @Get(':id')
  @ApiOkResponse({ type: ExerciseEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new ExerciseEntity(await this.exercisesService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ExerciseEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return new ExerciseEntity(
      await this.exercisesService.update(id, updateExerciseDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ExerciseEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ExerciseEntity(await this.exercisesService.remove(id));
  }
}
