import { JSX } from "react";

// User type aligned with Prisma User model
export type UserProps = {
  token: UserProps;
  id: string;
  name: string 
  username: string;
  description?: string
  location?: string
  website?: string
  whatsapp?: string
  isPremium?: boolean;
  isVip?: boolean;
  isElite?: boolean;
  createdAt: Date;
  updatedAt: Date;
  photoUrl?: string
  headerUrl?: string 
  category?: string; 
  tiktok?: string
  youtube?: string 
  facebook?: string 
  x?: string 
  instagram?: string
  twitch?: string
  bluesky?: string 
  youtubePlayerUrl?: string 
  youtubePlayerTitle?: string 
  youtubePlayerUrls?: { url: string; title: string }[]

  // Relations
  followers: UserProps[]; // maps to User_B in Prisma
  following: UserProps[]; // maps to User_A in Prisma
  posts: PostProps[]; // Post_Post_authorIdToUser
  likedPosts: PostProps[]; // Post_userLikes
  repostedPosts: PostProps[]; // Post_userReposts
  messagesSent: MessageProps[]; // Message_Message_senderIdToUser
  messagesReceived: MessageProps[]; // Message_Message_recipientIdToUser
  notifications: NotificationProps[];
  stories: StoryProps[];
};

// Post aligned with Prisma Post model
export type PostProps = {
  id: string;
  text: string;
  createdAt: Date;
  authorId: string;
  photoUrl?: string | null;
  isRepost: boolean;
  repostOfId?: string | null;
  isReply: boolean;
  repliedToId?: string | null;
  mediaUrl?: string | null;
};

// Message aligned with Prisma Message model
export type MessageProps = {
  id: string;
  text: string;
  createdAt: Date;
  senderId: string;
  recipientId: string;
  photoUrl?: string | null;
};

// Notification aligned with Prisma Notification model
export type NotificationProps = {
  id: string;
  type: string;
  createdAt: Date;
  isRead: boolean;
  userId: string;
  content: string;
};

// Story aligned with Prisma Story model
export type StoryProps = {
  id: number;
  photoUrl: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
};

// Response wrapper for fetching user
export type UserResponse = {
  success: boolean;
  user: UserProps;
};

// Props for Profile page/component
export interface ProfileProps {
  profile: UserProps;
  youtubePlayerUrl?: string;
  youtubePlayerTitle?: JSX.Element;
  youtubePlayerUrls?: { url: string; title: string }[];
}

// Snackbar props
export interface SnackbarProps {
  message: string;
  severity: "success" | "info" | "warning" | "error";
  open: boolean;
}

// Category icons mapping
export type CategoryIconsType = {
  [key: string]: JSX.Element;
};

// Auth token interface
export interface AuthToken {
  id: string;
  username: string;
  [key: string]: any;
}
