import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyJwtToken } from "@/utilities/auth";
import { createNotification } from "@/utilities/fetch";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params: { postId, username } }: { params: { postId: string; username: string } }
) {
    const tokenOwnerId = await request.json();

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

    if (verifiedToken.id !== tokenOwnerId)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    try {
        await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                likedBy: {
                    connect: {
                        id: tokenOwnerId,
                    },
                },
            },
        });

        if (username !== verifiedToken.username) {
            const notificationContent = {
                sender: {
                    username: verifiedToken.username,
                    name: verifiedToken.name,
                    photoUrl: verifiedToken.photoUrl,
                },
                content: {
                    id: postId,
                },
            };

            await createNotification(username, "like", secret, notificationContent);
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}
