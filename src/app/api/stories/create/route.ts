import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/prisma/client";

export async function POST(request: NextRequest) {
    let img: string;
    try {
        const body = await request.json();
        img = body.img;
        if (!img || typeof img !== "string" || img.trim() === "") {
            return NextResponse.json({ success: false, message: "Invalid image URL" }, { status: 400 });
        }
    } catch { 
        return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    if (!token) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let verifiedToken: UserProps;
    try {
        verifiedToken = await verifyJwtToken(token);
        if (!verifiedToken || !verifiedToken.id) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }
    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.json({ success: false, message: "Token verification failed" }, { status: 401 });
    }

    try {
        const existingStory = await prisma.story.findFirst({
            where: { userId: verifiedToken.id },
        });
        if (existingStory) {
            await prisma.story.delete({ where: { id: existingStory.id } });
        }

        const newStory = await prisma.story.create({
            data: {
                img,
                userId: verifiedToken.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            include: { user: true },
        });

        return NextResponse.json({ success: true, data: newStory }, { status: 201 });
    } catch (error) {
        console.error("Failed to create story:", error);
        return NextResponse.json({ success: false, message: "Failed to create story" }, { status: 500 });
    }
}