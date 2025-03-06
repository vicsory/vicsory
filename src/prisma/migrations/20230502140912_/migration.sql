/*
  Warnings:

  - You are about to drop the column `parentId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Repost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Repost" DROP CONSTRAINT "Repost_repostedById_fkey";

-- DropForeignKey
ALTER TABLE "Repost" DROP CONSTRAINT "Repost_postOriginId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_parentId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "parentId",
ADD COLUMN     "isRepost" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Repost";

-- CreateTable
CREATE TABLE "Reply" (
    "id" TEXT NOT NULL,
    "text" VARCHAR(280) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "parentId" TEXT,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userReposts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_userReplyLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userReposts_AB_unique" ON "_userReposts"("A", "B");

-- CreateIndex
CREATE INDEX "_userReposts_B_index" ON "_userReposts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_userReplyLikes_AB_unique" ON "_userReplyLikes"("A", "B");

-- CreateIndex
CREATE INDEX "_userReplyLikes_B_index" ON "_userReplyLikes"("B");

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userReposts" ADD CONSTRAINT "_userReposts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userReposts" ADD CONSTRAINT "_userReposts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userReplyLikes" ADD CONSTRAINT "_userReplyLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userReplyLikes" ADD CONSTRAINT "_userReplyLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
