/*
  Warnings:

  - You are about to drop the `WorkoutsOnExercices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutsOnExercices" DROP CONSTRAINT "WorkoutsOnExercices_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutsOnExercices" DROP CONSTRAINT "WorkoutsOnExercices_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "exercices" DROP CONSTRAINT "exercices_createdUserId_fkey";

-- DropForeignKey
ALTER TABLE "exercices" DROP CONSTRAINT "exercices_groupId_fkey";

-- DropTable
DROP TABLE "WorkoutsOnExercices";

-- DropTable
DROP TABLE "exercices";

-- CreateTable
CREATE TABLE "exercises" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdUserId" INTEGER NOT NULL,
    "isPending" BOOLEAN NOT NULL DEFAULT false,
    "timed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutsOnExercises" (
    "exerciseId" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "WorkoutsOnExercises_pkey" PRIMARY KEY ("exerciseId","workoutId")
);

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutsOnExercises" ADD CONSTRAINT "WorkoutsOnExercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutsOnExercises" ADD CONSTRAINT "WorkoutsOnExercises_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
