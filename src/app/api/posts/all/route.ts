import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = 10; // Use number directly instead of string

    const parsedPage = parseInt(page, 10);
    const parsedLimit = limit;
    const nextPage = parsedPage + 1;

    if (isNaN(parsedPage) || parsedPage < 1) {
        return NextResponse.json({ success: false, error: "Invalid page number" }, { status: 400 });
    }

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
                        photoUrl: true,
                        description: true,
                        category: true,
                        followers: {
                            select: { id: true }, // Essential for Follow button
                        },
                    },
                },
                likedBy: {
                    select: { id: true }, // Optimize: only id if counting likes
                },
                repostedBy: {
                    select: { id: true }, // Optimize: only id if counting reposts
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
                        likedBy: { select: { id: true } },
                        repostedBy: { select: { id: true } },
                        photoUrl: true,
                        text: true,
                        isReply: true,
                        repliedTo: {
                            select: {
                                id: true,
                                author: { select: { id: true, username: true } },
                            },
                        },
                        replies: { select: { authorId: true } },
                    },
                },
                replies: { select: { id: true } },
                repliedTo: {
                    select: {
                        id: true,
                        author: { select: { id: true, username: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" }, // Simplified from array
            skip: (parsedPage - 1) * parsedLimit,
            take: parsedLimit,
        });

        const totalPosts = await prisma.post.count({ where: { isReply: false } });
        const lastPage = Math.ceil(totalPosts / parsedLimit);

        return NextResponse.json({ success: true, posts, nextPage, lastPage });
    } catch (error: unknown) {
        console.error("Error fetching all posts:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}