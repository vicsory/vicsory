import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(_request: NextRequest, { params: { postId } }: { params: { postId: string } }) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
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
                    },
                },
                likedBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        description: true,
                        photoUrl: true,
                        isPremium: true,
                        category: true,
                        followers: {
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
                repostedBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        description: true,
                        photoUrl: true,
                        isPremium: true,
                        category: true,
                        followers: {
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
                        replies: {
                            select: {
                                authorId: true,
                            },
                        },
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
                replies: {
                    select: {
                        authorId: true,
                    },
                },
            },
        });
        return NextResponse.json({ success: true, post });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}
