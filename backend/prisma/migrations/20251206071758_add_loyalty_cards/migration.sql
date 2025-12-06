-- CreateTable
CREATE TABLE "loyaltyCards" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "telegramId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "loyaltyCards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loyaltyCards_telegramId_key" ON "loyaltyCards"("telegramId");

-- AddForeignKey
ALTER TABLE "loyaltyCards" ADD CONSTRAINT "loyaltyCards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
