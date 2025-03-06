// types/UserProps.ts
export type UserProps = {
    id: string;
    name: string | null;
    username: string;
    description: string | null;
    location: string | null;
    website: string | null;
    whatsapp: string | null;
    job: string | null;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    photoUrl: string | null;
    headerUrl: string | null;
    followers: (UserProps | string)[];
    following: (UserProps | string)[];
    category: string;
};

export type UserResponse = {
    success: boolean;
    user: UserProps;
};