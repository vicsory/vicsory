import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params; // Await and destructure

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        location: true,
        website: true,
        whatsapp: true, // Added whatsapp field
        isPremium: true,
        photoUrl: true,
        headerUrl: true,
        category: true,
        followers: {
          select: {
            id: true,
            name: true,
            username: true,
            description: true,
            category: true,
            isPremium: true,
            photoUrl: true,
            whatsapp: true, // Added whatsapp to followers
            followers: {
              select: {
                id: true,
              },
            },
            following: {
              select: {
                id: true,
              },
            },
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
            whatsapp: true, // Added whatsapp to following
            followers: {
              select: {
                id: true,
              },
            },
            following: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}