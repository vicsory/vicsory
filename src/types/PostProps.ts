// @/types/PostProps.ts
import { ReactNode } from "react";
import { UserProps } from "./UserProps";

export type PostProps = {
  id: string;
  text: string;
  content?: ReactNode; // optional for rendering
  createdAt: Date;
  authorId: string;
  author: UserProps;
  photoUrl?: string 
  mediaUrl?: string

  isRepost: boolean;
  repostOfId?: string 
  repostOf?: PostProps
  repostedBy: UserProps[];
  reposts: PostProps[];
  repostedById: string;


  isReply: boolean;
  repliedToId?: string 
  repliedTo?: PostProps
  replies: PostProps[];

  likedBy: UserProps[];

  category?: string;
  isVip?: boolean;
  isPremium?: boolean;
  isElite?: boolean;
};

export type PostsArray = {
  posts: PostProps[];
};

export type PostResponse = {
  success: boolean;
  post: PostProps;
};

export type PostOptionsProps = {
  postId: string;
  postAuthorId: string;
};

export type NewPostProps = {
  token: string; // Use the auth token string
  handleSubmit?: () => void;
};
