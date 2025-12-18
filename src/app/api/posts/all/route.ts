import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let page = request.nextUrl.searchParams.get("page");
  const limit = "10";

  if (!page) {
    page = "1";
  }

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  let nextPage = parsedPage + 1;

  try {
    const posts = await prisma.post.findMany({
      where: {
        isReply: false,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            isPremium: true,
            isVip: true,
            isElite: true,
            category: true,
            photoUrl: true,
            description: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            isPremium: true,
            isVip: true,
            isElite: true,
            category: true,
            photoUrl: true,
            description: true,
          },
        },
        repostedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            isPremium: true,
            isVip: true,
            isElite: true,
            category: true,
            photoUrl: true,
            description: true,
          },
        },
        repostOf: {
          select: {
            id: true,
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                isPremium: true,
                isVip: true,
                isElite: true,
                category: true,
                photoUrl: true,
                description: true,
              },
            },
            authorId: true,
            createdAt: true,
            likedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                isPremium: true,
                isVip: true,
                isElite: true,
                category: true,
                photoUrl: true,
                description: true,
              },
            },
            repostedBy: {
              select: {
                id: true,
                username: true,
                name: true,
                isPremium: true,
                isVip: true,
                isElite: true,
                category: true,
                photoUrl: true,
                description: true,
              },
            },
            photoUrl: true,
            text: true,
            isReply: true,
            repliedTo: {
              select: {
                id: true,
                author: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    isPremium: true,
                    isVip: true,
                    isElite: true,
                    category: true,
                    photoUrl: true,
                    description: true,
                  },
                },
              },
            },
            replies: {
              select: {
                authorId: true,
              },
            },
          },
        },
        replies: {
          select: {
            id: true,
          },
        },
        repliedTo: {
          select: {
            id: true,
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                isPremium: true,
                isVip: true,
                isElite: true,
                category: true,
                photoUrl: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    });

    const totalPosts = await prisma.post.count();
    const lastPage = Math.ceil(totalPosts / parsedLimit);

    return NextResponse.json({ success: true, posts, nextPage, lastPage });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}
