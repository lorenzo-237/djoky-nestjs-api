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
import { WorkoutEntity } from './entities';

@Controller('workouts')
@ApiTags('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @ApiCreatedResponse({ type: WorkoutEntity })
  async create(
    @Body() createWorkoutDto: CreateWorkoutDto,
    @Session() session: Record<string, any>,
  ) {
    if (!session?.passport?.user?.id) {
      throw new UnauthorizedException();
    }

    const userId = session.passport.user.id;

    return new WorkoutEntity(
      await this.workoutsService.create(userId, createWorkoutDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: WorkoutEntity, isArray: true })
  async findAll() {
    const workouts = await this.workoutsService.findAll();
    return workouts.map((workout) => new WorkoutEntity(workout));
  }

  @Get(':id')
  @ApiOkResponse({ type: WorkoutEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new WorkoutEntity(await this.workoutsService.findOne(id));
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
}
