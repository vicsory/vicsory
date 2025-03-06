"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react"; // Import React's use hook

import NotFound from "@/app/not-found";
import Profile from "@/components/user/Profile";
import CircularLoading from "@/components/misc/CircularLoading";
import { getUser } from "@/utilities/fetch";

export default function ProfileLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ username: string }>; // Type params as a Promise
}) {
    // Unwrap the params Promise using React.use()
    const { username } = use(params);

    const { isLoading, isFetched, data } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUser(username),
    });

    if (isLoading) return <CircularLoading />;

    if (isFetched && !data.user) return <NotFound />;

    return (
        <div className="profile-layout">
            {isFetched && <Profile profile={data.user} />}
            {children}
        </div>
    );
}