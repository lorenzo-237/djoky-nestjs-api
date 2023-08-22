/*
  Warnings:

  - You are about to drop the `_exercices-workouts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_exercices-workouts" DROP CONSTRAINT "_exercices-workouts_A_fkey";

-- DropForeignKey
ALTER TABLE "_exercices-workouts" DROP CONSTRAINT "_exercices-workouts_B_fkey";

-- AlterTable
ALTER TABLE "exercices" ADD COLUMN     "timed" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_exercices-workouts";

-- CreateTable
CREATE TABLE "WorkoutsOnExercices" (
    "exerciseId" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "WorkoutsOnExercices_pkey" PRIMARY KEY ("exerciseId","workoutId")
);

-- AddForeignKey
ALTER TABLE "WorkoutsOnExercices" ADD CONSTRAINT "WorkoutsOnExercices_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutsOnExercices" ADD CONSTRAINT "WorkoutsOnExercices_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
