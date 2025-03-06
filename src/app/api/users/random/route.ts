import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/prisma/client";

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "You are not logged in." },
                { status: 401 }
            );
        }

        const verifiedToken: UserProps = await verifyJwtToken(token);

        if (!verifiedToken) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token." },
                { status: 401 }
            );
        }

        const username = verifiedToken.username as string;

        // Count premium users excluding the logged-in user and their followers
        const usersCount = await prisma.user.count({
            where: {
                isPremium: true,
                NOT: [
                    { username },
                    {
                        followers: {
                            some: { username },
                        },
                    },
                ],
                photoUrl: { not: "" },
            },
        });

        // Calculate skip value, ensuring it's within bounds
        const skip = Math.max(0, Math.floor(Math.random() * (usersCount - 3)) || 0);

        // Fetch a random subset of users
        const users = await prisma.user.findMany({
            where: {
                isPremium: true,
                NOT: [
                    { username },
                    {
                        followers: {
                            some: { username },
                        },
                    },
                ],
                photoUrl: { not: "" },
            },
            select: {
                name: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                description: true,
                category: true,
                location: true,
                website: true,
                photoUrl: true,
                isPremium: true,
                headerUrl: true,
                followers: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        description: true,
                        category: true,
                        isPremium: true,
                        photoUrl: true,
                        followers: { select: { id: true } },
                        following: { select: { id: true } },
                    },
                },
                following: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        description: true,
                        category: true,
                        isPremium: true,
                        photoUrl: true,
                        followers: { select: { id: true } },
                        following: { select: { id: true } },
                    },
                },
            },
            skip,
            take: 3,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, users });
    } catch (error: unknown) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred while fetching users." },
            { status: 500 }
        );
    }
}