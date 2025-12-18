export type UserProps = {
  id: string;
  name: string;
  username: string;
  description?: string | null;
  location?: string | null;
  website?: string | null;
  whatsapp?: string | null;
  category?: string | null;

  isPremium: boolean;
  isVip: boolean;
  isElite: boolean;

  createdAt: Date;
  updatedAt: Date;

  photoUrl?: string | null;
  headerUrl?: string | null;

  followers: UserProps[];
  following: UserProps[];

  x?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitch?: string | null;
  bluesky?: string | null;

  youtubePlayerUrl?: string | null;
  youtubePlayerTitle?: string | null;
  youtubePlayerUrls?: { url: string; title: string }[] | null;
};

export type UserResponse = {
  success: boolean;
  user: UserProps;
};
