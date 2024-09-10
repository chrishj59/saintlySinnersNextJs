/*
  Warnings:

  - The `birthDate` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `county` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `mobPhone` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `postCode` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `street` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `street2` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `town` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthDate",
ADD COLUMN     "birthDate" DATE,
ALTER COLUMN "county" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "mobPhone" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "postCode" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "street" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "street2" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "town" SET DATA TYPE VARCHAR(40);
