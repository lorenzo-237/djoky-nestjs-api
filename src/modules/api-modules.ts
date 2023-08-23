import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ExercisesModule } from 'src/exercises/exercises.module';
import { GroupsModule } from 'src/groups/groups.module';
import { UsersModule } from 'src/users/users.module';
import { WorkoutsModule } from 'src/workouts/workouts.module';

const apiModules = [
  AuthModule,
  UsersModule,
  WorkoutsModule,
  ExercisesModule,
  GroupsModule,
  CategoriesModule,
];

export default apiModules;
