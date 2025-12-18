import { UserProps } from "./UserProps";

export type PostProps = {
    id: string;
    text: string;
    createdAt: Date;
    author: UserProps;
    authorId: string;
    photoUrl: string;
    likedBy: UserProps[];
    reposts: PostProps[];
    replies: PostProps[];
    isRepost: boolean;
    repostedBy: UserProps[];
    repostedById: string;
    repostOf: PostProps;
    isReply: boolean;
    repliedTo: PostProps;
    repliedToId: string;
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
    postAuthor: string;
};

export type NewPostProps = {
    token: UserProps;
    handleSubmit?: () => void;
};
