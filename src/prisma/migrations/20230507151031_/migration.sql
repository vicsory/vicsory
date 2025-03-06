-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_repliedToId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_repostOfId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_repostOfId_fkey" FOREIGN KEY ("repostOfId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_repliedToId_fkey" FOREIGN KEY ("repliedToId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
