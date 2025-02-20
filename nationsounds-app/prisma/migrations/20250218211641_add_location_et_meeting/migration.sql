-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lieuId" INTEGER NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_artistId_key" ON "Meeting"("artistId");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
