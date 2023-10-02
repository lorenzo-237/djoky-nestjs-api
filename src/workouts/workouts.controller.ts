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
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WorkoutEntity, WorkoutResponse } from './entities';
import { SessionPassport } from 'src/utils/types';

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
  async findAll(@Session() session: SessionPassport) {
    const workoutsDb = await this.workoutsService.findAll(
      session.passport.user.id,
      false,
    );
    const workouts = workoutsDb.map((workout) => new WorkoutEntity(workout));
    return { count: workouts.length, rows: workouts };
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
