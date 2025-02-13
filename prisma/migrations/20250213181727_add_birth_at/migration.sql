/*
  Warnings:

  - Added the required column `birth_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birth_at" TIMESTAMP(3) NOT NULL;
