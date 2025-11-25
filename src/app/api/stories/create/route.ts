import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    // Parse and validate the request body
    let img: string;
    try {
        const body = await request.json();
        img = body.img;

        // Validate the image URL (example: check if it's a non-empty string)
        if (!img || typeof img !== "string" || img.trim() === "") {
            return NextResponse.json(
                { success: false, message: "Invalid image URL." },
                { status: 400 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Invalid request body." },
            { status: 400 }
        );
    }

    // Verify the JWT token
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    if (!token) {
        return NextResponse.json(
            { success: false, message: "You are not authorized to perform this action." },
            { status: 401 }
        );
    }

    let verifiedToken: UserProps;
    try {
        verifiedToken = await verifyJwtToken(token);
        if (!verifiedToken) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token." },
                { status: 401 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to verify token." },
            { status: 500 }
        );
    }

    // Check for existing story and delete if it exists
    try {
        const existingStory = await prisma.story.findFirst({
            where: {
                userId: verifiedToken.id,
            },
        });

        if (existingStory) {
            await prisma.story.delete({
                where: {
                    id: existingStory.id,
                },
            });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete existing story." },
            { status: 500 }
        );
    }

    // Create new story
    try {
        const newStory = await prisma.story.create({
            data: {
                img,
                user: {
                    connect: {
                        id: verifiedToken.id,
                    },
                },
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiration
            },
            include: {
                user: true,
            },
        });

        return NextResponse.json(
            { success: true, data: newStory },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to create story." },
            { status: 500 }
        );
    }
}