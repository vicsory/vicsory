"use client";

import { useContext } from "react";
import React from "react"; // Import React for React.use()

import { AuthContext } from "../../layout";
import CircularLoading from "@/components/misc/CircularLoading";
import EditProfile from "@/components/user/EditProfile";
import BackToArrow from "@/components/misc/BackToArrow";

export default function EditPage({ params }: { params: Promise<{ username: string }> }) {
    // Unwrap the params Promise using React.use()
    const resolvedParams = React.use(params);
    const { username } = resolvedParams;

    const { token, isPending, refreshToken } = useContext(AuthContext);

    if (isPending) return <CircularLoading />;

    if (!token) throw new Error("You must be logged in to view this page");
    if (username !== token.username) throw new Error("You are not authorized to view this page");

    return (
        <div>
            <BackToArrow title={username} url={`/${username}`} />
            <EditProfile profile={token} refreshToken={refreshToken} />
        </div>
    );
}