// @/types/StoryProps.ts
import { UserProps } from "./UserProps";

export type StoryProps = {
    id: number;          // Unique identifier for the story (matches Prisma schema)
    img: string;         // URL of the story image
    createdAt: Date;     // When the story was created
    expiresAt: Date;     // When the story expires (e.g., 24 hours after creation)
    user: UserProps;     // The author of the story
    userId: string;      // Foreign key linking to the user
};

export type StoriesArray = {
    stories: StoryProps[]; // Array of stories for fetching multiple
};

export type StoryResponse = {
    success: boolean;      // Indicates if the operation was successful
    story: StoryProps;     // The created or retrieved story
};

export type StoryOptionsProps = {
    storyId: number;       // ID of the story for operations (e.g., delete, edit)
    storyAuthor: string;   // Author’s ID for authorization checks
};

export type NewStoryProps = {
    token: UserProps;      // User data for authentication and story creation
    handleSubmit?: () => void; // Optional callback after submission
};