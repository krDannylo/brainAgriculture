/*
  Warnings:

  - Added the required column `farmId` to the `HarvestSeason` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HarvestSeason" ADD COLUMN     "farmId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Crop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "harvestSeasonId" INTEGER NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HarvestSeason" ADD CONSTRAINT "HarvestSeason_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_harvestSeasonId_fkey" FOREIGN KEY ("harvestSeasonId") REFERENCES "HarvestSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
