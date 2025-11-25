// ProfileLayout.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import NotFound from "@/app/not-found";
import Profile from "@/components/user/Profile";
import CircularLoading from "@/components/misc/CircularLoading";
import { getUser } from "@/utilities/fetch";
import { UserProps } from "@/types/UserProps"; // Import UserProps

interface UserResponse {
  success: boolean;
  user?: UserProps; // Use UserProps instead of { [key: string]: any }
}

export default function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const { isLoading, isFetched, data } = useQuery<UserResponse>({
    queryKey: ["users", username],
    queryFn: () => getUser(username),
  });

  if (isLoading) return <CircularLoading />;

  if (!data || !data.success || !data.user) {
    return isFetched ? <NotFound /> : <CircularLoading />;
  }

  return (
    <div className="profile-layout">
      <Profile profile={data.user} />
      {children}
    </div>
  );
}