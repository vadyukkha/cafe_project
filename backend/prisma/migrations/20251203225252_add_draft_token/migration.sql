/*
  Warnings:

  - A unique constraint covering the columns `[draftToken]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - The required column `draftToken` was added to the `orders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
ALTER TABLE "orders" ADD COLUMN     "draftToken" TEXT;

UPDATE "orders" SET "draftToken" = gen_random_uuid()::text WHERE "draftToken" IS NULL;

ALTER TABLE "orders" ALTER COLUMN "draftToken" SET NOT NULL;

CREATE UNIQUE INDEX "orders_draftToken_key" ON "orders"("draftToken");
