import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/utilities/auth";
import { UserProps } from "@/types/UserProps";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

interface Conversation {
  participants: string[];
  messages: MessageWithUsers[];
}

type MessageWithUsers = Prisma.MessageGetPayload<{
  include: {
    sender: { select: { name: true; username: true; photoUrl: true; isPremium: true } };
    recipient: { select: { name: true; username: true; photoUrl: true; isPremium: true } };
  };
}>;

export async function GET({ params: { username } }: { params: { username: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No authentication token provided" },
        { status: 401 }
      );
    }

    const verifiedToken: UserProps | null = await verifyJwtToken(token);
    
    if (!verifiedToken) {
      return NextResponse.json(
        { success: false, message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    if (verifiedToken.username !== username) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender: { username } },
          { recipient: { username } },
        ],
      },
      include: {
        sender: {
          select: {
            name: true,
            username: true,
            photoUrl: true,
            isPremium: true,
          },
        },
        recipient: {
          select: {
            name: true,
            username: true,
            photoUrl: true,
            isPremium: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const conversations: Record<string, Conversation> = {};

    messages.forEach((message: MessageWithUsers) => {
      const sender = message.sender.username;
      const recipient = message.recipient.username;
      const conversationKey = [sender, recipient].sort().join("-");

      if (!conversations[conversationKey]) {
        conversations[conversationKey] = {
          participants: [sender, recipient],
          messages: [],
        };
      }
      conversations[conversationKey].messages.push(message);
    });

    const formattedConversations = Object.values(conversations)
      .sort((a: Conversation, b: Conversation) => {
        const lastMessageA = a.messages[a.messages.length - 1].createdAt;
        const lastMessageB = b.messages[b.messages.length - 1].createdAt;
        return lastMessageB.getTime() - lastMessageA.getTime();
      });

    return NextResponse.json({ 
      success: true, 
      formattedConversations 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}