-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'PENDING';
