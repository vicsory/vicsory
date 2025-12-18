import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { username } }: { params: { username: string } }
) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          username: username,
        },
        isReply: true,
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
    });
    return NextResponse.json({ success: true, posts });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error });
  }
}
