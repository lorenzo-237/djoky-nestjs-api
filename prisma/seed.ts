import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

function encodePassword(password: string) {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
}

const prisma = new PrismaClient();

async function main() {
  // Insert sample data for the User model
  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: encodePassword('admin'),
        firstname: 'Admin',
        lastname: 'Dev',
        role: 'ADMIN',
      },
      {
        username: 'lorenzo',
        email: 'lorenzo@example.com',
        password: encodePassword('lorenzo'),
        firstname: 'Lorenzo',
        lastname: 'Dev',
        role: 'MANAGER',
      },
      {
        username: 'djoky',
        email: 'djoky@example.com',
        password: encodePassword('djoky'),
        firstname: 'Djoky',
        lastname: 'Dev',
        role: 'USER',
      },
      // Add more users as needed...
    ],
  });

  // Insert sample data for the Category model
  await prisma.category.createMany({
    data: [
      {
        name: 'Category 1',
        createdUserId: 1,
      },
      {
        name: 'Category 2',
        createdUserId: 1,
      },
      {
        name: 'Category 3',
        createdUserId: 2,
      },
      // Add more categories as needed...
    ],
  });

  // Insert sample data for the Group model
  await prisma.group.createMany({
    data: [
      {
        name: 'Group 1',
        categoryId: 1,
        createdUserId: 1,
      },
      {
        name: 'Group 2',
        categoryId: 2,
        createdUserId: 1,
      },
      {
        name: 'Group 3',
        categoryId: 2,
        createdUserId: 1,
      },
      {
        name: 'Group 4',
        categoryId: 3,
        createdUserId: 2,
      },
      // Add more groups as needed...
    ],
  });

  // Insert sample data for the Exercise model
  await prisma.exercise.createMany({
    data: [
      {
        name: 'Exercise 1',
        description: 'Description of Exercise 1',
        groupId: 1,
        createdUserId: 1,
      },
      {
        name: 'Exercise 2',
        description: 'Description of Exercise 2',
        groupId: 2,
        createdUserId: 1,
      },
      {
        name: 'Exercise 3',
        description: 'Description of Exercise 3',
        groupId: 1,
        createdUserId: 1,
      },
      {
        name: 'Exercise 4',
        description: 'Description of Exercise 4',
        groupId: 1,
        createdUserId: 1,
      },
      {
        name: 'Exercise 5',
        description: 'Description of Exercise 5',
        groupId: 3,
        createdUserId: 1,
      },
      {
        name: 'Exercise 6',
        description: 'Description of Exercise 5',
        groupId: 4,
        createdUserId: 2,
      },
      // Add more exercises as needed...
    ],
  });

  // Insert sample data for the Workout model
  await prisma.workout.createMany({
    data: [
      {
        date: new Date(),
        userId: 1,
      },
      {
        date: new Date(),
        userId: 2,
      },
      // Add more workouts as needed...
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
