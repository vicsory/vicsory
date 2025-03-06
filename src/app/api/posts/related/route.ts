import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const verifiedToken: UserProps = token && (await verifyJwtToken(token));

    if (!verifiedToken) {
        return NextResponse.json(
            { success: false, message: "You are not authorized to perform this action." },
            { status: 401 }
        );
    }

    try {
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { authorId: verifiedToken.id },
                    {
                        author: {
                            followers: {
                                some: { id: verifiedToken.id },
                            },
                        },
                    },
                ],
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
                            select: { id: true }, // For Follow button logic
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
                                followers: { // Optional: for repost author
                                    select: { id: true },
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
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, posts });
    } catch (error: unknown) {
        console.error("Error fetching home feed posts:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}