/*
  Warnings:

  - Added the required column `receiptPayment` to the `membership_fees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "membership_fees" ADD COLUMN     "receiptPayment" TEXT NOT NULL;
