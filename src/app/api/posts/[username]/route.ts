import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                author: {
                    username: username,
                },
                isReply: false,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        isPremium: true,
                        photoUrl: true,
                        description: true,
                        category: true,
                        followers: {
                            select: {
                                id: true, // Minimal data for follow check
                            },
                        },
                    },
                },
                likedBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        isPremium: true,
                        photoUrl: true,
                        description: true,
                        category: true,
                    },
                },
                repostedBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        isPremium: true,
                        photoUrl: true,
                        description: true,
                        category: true,
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
                                photoUrl: true,
                                description: true,
                                category: true,
                                followers: { // Optional: for repost author follow status
                                    select: {
                                        id: true,
                                    },
                                },
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
                                photoUrl: true,
                                description: true,
                                category: true,
                            },
                        },
                        repostedBy: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                isPremium: true,
                                photoUrl: true,
                                description: true,
                                category: true,
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
                                        photoUrl: true,
                                        description: true,
                                        category: true,
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
                                photoUrl: true,
                                description: true,
                                category: true,
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
        console.error("Error fetching posts for user:", username, error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}