"use server"; // Optional: Use if this is a Server Action, otherwise keep as-is for API route

import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params: { postId } }: { params: { postId: string } }) {
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
                        followers: {
                            select: {
                                id: true, // Minimal data needed for follow check
                            },
                        },
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
                                followers: { // Also add followers here if repost author follow status is needed
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

        if (!post) {
            return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, post });
    } catch (error: unknown) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}