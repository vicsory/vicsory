export type UserProps = {
  id: string;
  name: string;
  username: string;
  description: string;
  location: string;
  website: string;
  whatsapp: string;
  category: string;

  isPremium: boolean;
  isVip: boolean;
  isElite: boolean;

  createdAt: Date;
  updatedAt: Date;

  photoUrl: string;
  headerUrl: string;

  followers: UserProps[];
  following: UserProps[];

  x: string;
  tiktok: string;
  youtube: string;
  facebook: string;
  instagram: string;
  twitch: string;
  bluesky: string;

  youtubePlayerUrl: string;
  youtubePlayerTitle: string;
  youtubePlayerUrls?: { url: string; title: string }[];
};

export type UserResponse = {
  success: boolean;
  user: UserProps;
};
