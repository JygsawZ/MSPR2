-- CreateTable
CREATE TABLE "running_orders" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "sceneId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "running_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "running_orders" ADD CONSTRAINT "running_orders_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "running_orders" ADD CONSTRAINT "running_orders_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "scenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE; 