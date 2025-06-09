/*
  Warnings:

  - Added the required column `updatedAt` to the `Crop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Farm` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Farm` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Farmer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `HarvestSeason` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crop" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Farmer" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "HarvestSeason" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
