import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyJwtToken } from "@/utilities/auth";
import { createNotification } from "@/utilities/fetch";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params: { postId } }: { params: { postId: string } }) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                isReply: true,
                repliedToId: postId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        description: true,
                        isPremium: true,
                        photoUrl: true,
                    },
                },
                likedBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        description: true,
                        isPremium: true,
                        photoUrl: true,
                        followers: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                photoUrl: true,
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
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json({ success: true, posts });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}

export async function POST(
    request: NextRequest,
    { params: { postId, username } }: { params: { postId: string; username: string } }
) {
    const { authorId, text, photoUrl } = await request.json();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const verifiedToken: UserProps = token && (await verifyJwtToken(token));

    const secret = process.env.CREATION_SECRET_KEY;

    if (!secret) {
        return NextResponse.json({
            success: false,
            message: "Secret key not found.",
        });
    }

    if (!verifiedToken)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    if (verifiedToken.id !== authorId)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    try {
        await prisma.post.create({
            data: {
                isReply: true,
                text,
                photoUrl,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
                repliedTo: {
                    connect: {
                        id: postId,
                    },
                },
            },
        });

        if (username !== verifiedToken.username) {
            const notificationContent = {
                sender: {
                    username: verifiedToken.username,
                    name: verifiedToken.name,
                    photoUrl: verifiedToken.photoUrl || "",
                },
                content: {
                    id: postId,
                },
            };

            await createNotification(username, "reply", secret, notificationContent);
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}
