/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `verificationCode` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `emailVerifyAt` DATETIME(3) NULL,
    ADD COLUMN `verificationCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `password` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `profiles_verificationCode_key` ON `profiles`(`verificationCode`);
