import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/prisma/client";

export async function GET(request: NextRequest) {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    const verifiedToken: UserProps = token && (await verifyJwtToken(token));

    if (!verifiedToken)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    try {
        await prisma.notification.updateMany({
            where: {
                userId: verifiedToken.id,
            },
            data: {
                isRead: true,
            },
        });
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}
