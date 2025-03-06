-- AlterTable
ALTER TABLE "_userFollows" ADD CONSTRAINT "_userFollows_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_userFollows_AB_unique";

-- AlterTable
ALTER TABLE "_userLikes" ADD CONSTRAINT "_userLikes_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_userLikes_AB_unique";

-- AlterTable
ALTER TABLE "_userReposts" ADD CONSTRAINT "_userReposts_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_userReposts_AB_unique";
