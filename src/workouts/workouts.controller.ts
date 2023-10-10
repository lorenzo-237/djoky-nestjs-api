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
  Query,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WorkoutEntity, WorkoutResponse } from './entities';
import { SessionPassport } from 'src/utils/types';
import { CreateWorkoutDto, UpdateWorkoutDto, WorkoutFilterDto } from './dto';
import adjustEndOfDay from './functions/adjust-end-of-day';
import parsePositiveNonNullInt from './functions/parse-positive-non-null-int';
import { SIZE_PAGE } from './constants';

@Controller('workouts')
@ApiTags('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @ApiCreatedResponse({ type: WorkoutEntity })
  async create(
    @Body() createWorkoutDto: CreateWorkoutDto,
    @Session() session: SessionPassport,
  ) {
    if (!session.passport.user.id) {
      throw new UnauthorizedException();
    }

    const userId = session.passport.user.id;

    return new WorkoutEntity(
      await this.workoutsService.create(userId, createWorkoutDto),
    );
  }

  // todo : faire les routes pour admin (il peut sélectionner l'utilisateur qu'il souhaite)

  @Get()
  @ApiOkResponse({ type: WorkoutResponse })
  async findAll(
    @Session() session: SessionPassport,
    @Query() filter: WorkoutFilterDto,
  ) {
    const intPage = parsePositiveNonNullInt(filter.page, 1);
    const intSize = parsePositiveNonNullInt(filter.pageSize, SIZE_PAGE);

    const { count, totalPage, workoutsDb } = await this.workoutsService.findAll(
      {
        userId: session.passport.user.id,
        admin: false,
        startDate: filter.startDate ? new Date(filter.startDate) : undefined,
        endDate: filter.endDate
          ? adjustEndOfDay(new Date(filter.endDate))
          : undefined,
        page: intPage,
        pageSize: intSize,
      },
    );
    const workouts = workoutsDb.map((workout) => new WorkoutEntity(workout));
    return {
      page: count > 0 ? intPage : 0,
      pageSize: count > 0 ? intSize : 0,
      totalPage,
      count: count,
      rows: workouts,
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: WorkoutEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionPassport,
  ) {
    const dbWorkout = await this.workoutsService.findOne(id);
    const findWorkout = new WorkoutEntity(dbWorkout);
    if (session.passport.user.id === findWorkout.user.id) return findWorkout;

    throw new UnauthorizedException();
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: WorkoutEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return new WorkoutEntity(
      await this.workoutsService.update(id, updateWorkoutDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: WorkoutEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new WorkoutEntity(await this.workoutsService.remove(id));
  }

  // todo : /workouts/:id/exercices
  // {
  //  exercices: [{ id: 1, repet: 10, series: 4, weight: 10}, {...}, ...]
  // }
}
