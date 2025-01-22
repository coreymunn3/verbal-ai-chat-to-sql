/*
  Warnings:

  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Company";

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "valuation" DOUBLE PRECISION NOT NULL,
    "dateJoined" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "industry" TEXT NOT NULL,
    "investors" TEXT NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);
