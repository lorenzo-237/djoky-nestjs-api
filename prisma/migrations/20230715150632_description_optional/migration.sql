-- AlterTable
ALTER TABLE "exercices" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "workouts" ADD COLUMN     "description" TEXT;
