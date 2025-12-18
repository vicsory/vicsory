import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params: { postId } }: { params: { postId: string } }) {
    const tokenOwnerId = await request.json();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const verifiedToken: UserProps = token && (await verifyJwtToken(token));

    if (!verifiedToken)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    if (verifiedToken.id !== tokenOwnerId)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    try {
        const originalPost = await prisma.post.findFirst({
            where: {
                id: postId,
            },
            include: {
                reposts: true,
            },
        });

        await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                repostedBy: {
                    disconnect: {
                        id: tokenOwnerId,
                    },
                },
            },
        });

        const repostId = originalPost?.reposts.find((repost: any) => repost.authorId === tokenOwnerId)?.id;

        await prisma.post.delete({
            where: {
                id: repostId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}
