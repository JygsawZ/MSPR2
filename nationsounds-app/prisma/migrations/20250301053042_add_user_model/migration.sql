-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_sceneId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistTag" DROP CONSTRAINT "ArtistTag_artistId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistTag" DROP CONSTRAINT "ArtistTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_lieuId_fkey";

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistTag" ADD CONSTRAINT "ArtistTag_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistTag" ADD CONSTRAINT "ArtistTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
