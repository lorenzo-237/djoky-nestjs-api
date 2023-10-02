import { ApiProperty } from '@nestjs/swagger';
import { ExerciseGroup } from 'src/exercises/entities';
import { PrismaEntityWorkout } from '../types';

export class WorkoutUser {
  @ApiProperty()
  id: number;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
}

export class WorkoutExercise {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ type: ExerciseGroup })
  group: ExerciseGroup;

  @ApiProperty()
  assignedAt: Date;

  @ApiProperty()
  series: number;

  @ApiProperty()
  repetitions: number;

  @ApiProperty()
  time: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  total: number;
}

export class WorkoutEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty({ type: WorkoutUser })
  user: WorkoutUser;

  @ApiProperty({ type: WorkoutExercise, isArray: true })
  exercises?: WorkoutExercise[];

  constructor(partial: Partial<PrismaEntityWorkout>) {
    if (!partial) {
      return null;
    }

    this.id = partial.id;
    this.date = partial.date;
    this.description = partial.description;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
    this.deletedAt = partial.deletedAt;
    this.isDeleted = partial.isDeleted;

    if (partial.user) {
      this.user = {
        id: partial.user.id,
        firstname: partial.user.firstname,
        lastname: partial.user.lastname,
      };
    }

    if (partial.exercises) {
      this.exercises = partial.exercises.map((item) => {
        const workoutExercise = new WorkoutExercise();
        workoutExercise.id = item.exercise.id;
        workoutExercise.name = item.exercise.name;
        workoutExercise.description = item.exercise.description;
        workoutExercise.group = item.exercise.group;
        workoutExercise.series = item.series;
        workoutExercise.repetitions = item.repetitions;
        workoutExercise.time = item.time;
        workoutExercise.weight = item.weight;
        workoutExercise.total = item.total;
        workoutExercise.assignedAt = item.assignedAt;
        return workoutExercise;
      });
    }
  }
}
