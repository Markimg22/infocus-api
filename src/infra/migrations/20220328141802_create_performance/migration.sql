-- CreateTable
CREATE TABLE "performance" (
    "id" TEXT NOT NULL,
    "total_work_time" INTEGER NOT NULL DEFAULT 0,
    "total_rest_time" INTEGER NOT NULL DEFAULT 0,
    "total_tasks_finished" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "performance_id_key" ON "performance"("id");

-- CreateIndex
CREATE UNIQUE INDEX "performance_user_id_key" ON "performance"("user_id");

-- AddForeignKey
ALTER TABLE "performance" ADD CONSTRAINT "performance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
