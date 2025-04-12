/*
  Warnings:

  - Added the required column `status` to the `PurchaseRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('accepted', 'pending', 'declined');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('fruit', 'vegetable', 'alcoholicBeverage', 'juice', 'dairy', 'other');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'other';

-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "finished" TIMESTAMP(3),
ADD COLUMN     "quantity" TEXT,
ADD COLUMN     "status" "Status" NOT NULL;
