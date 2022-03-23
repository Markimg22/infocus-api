-- CreateTable
CREATE TABLE "access_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_token_id_key" ON "access_token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "access_token_user_id_key" ON "access_token"("user_id");

-- AddForeignKey
ALTER TABLE "access_token" ADD CONSTRAINT "access_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
