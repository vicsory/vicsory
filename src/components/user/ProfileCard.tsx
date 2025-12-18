import { useQuery } from "@tanstack/react-query";
import { AiFillTwitterCircle } from "react-icons/ai";
import Image from "next/image";

import { getUser } from "@/utilities/fetch";
import { getFullURL } from "@/utilities/misc/getFullURL";
import CircularLoading from "../misc/CircularLoading";
import { UserProps } from "@/types/UserProps";
import { VerifiedToken } from "@/types/TokenProps";

export default function ProfileCard({
    username,
    token,
}: {
    username: string;
    token: VerifiedToken;
}) {
    const { isLoading, data } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUser(username),
    });

    if (isLoading) return <CircularLoading />;

    const isFollowingTokenOwner = () => {
        if (!token || data.user.following.length === 0) return false;
        return data.user.following.some(
            (user: UserProps) => user.id === token.id
        );
    };

    return (
        <div className="w-72 rounded-2xl bg-[var(--background-primary)] border border-solid border-[var(--border)] p-4 shadow-lg">

            {/* Avatar */}
            <div className="flex items-center gap-3">
                <Image
                    src={
                        data.user.photoUrl
                            ? getFullURL(data.user.photoUrl)
                            : "/assets/egg.jpg"
                    }
                    alt=""
                    width={75}
                    height={75}
                    className="rounded-full object-cover w-[75px] h-[75px]"
                />

                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-[var(--text)] text-lg">
                            {data.user.name || data.user.username}
                        </span>

                        {data.user.isPremium && (
                            <AiFillTwitterCircle
                                className="text-sky-500 w-5 h-5"
                                title="Verified Blue"
                            />
                        )}
                    </div>

                    <span className="text-[var(--text-secondary)] text-sm">
                        @{data.user.username}{" "}
                        {isFollowingTokenOwner() && (
                            <span className="ml-1 text-xs text-[var(--blue)]">
                                Follows you
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* Bio */}
            {data.user.description && (
                <p className="mt-3 text-sm text-[var(--text)] leading-5 break-words">
                    {data.user.description}
                </p>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-4 text-sm">
                <div className="flex gap-1">
                    <span className="font-semibold text-[var(--text)]">
                        {data.user.followers.length}
                    </span>
                    <span className="text-[var(--text-secondary)]">
                        Followers
                    </span>
                </div>
            </div>
        </div>
    );
}
