import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/utilities/fetch";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import CircularLoading from "../misc/CircularLoading";
import { UserProps } from "@/types/UserProps";
import { VerifiedToken } from "@/types/TokenProps";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Follow from "./Follow";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../public/svg/verify-badge";

export default function ProfileCard({ username, token }: { username: string; token: VerifiedToken }) {
    const { isLoading, data } = useQuery({
        queryKey: ["users", username],
        queryFn: () => getUser(username),
    });

    if (isLoading) return <CircularLoading />;

    const isFollowingTokenOwner = () => {
        if (data.user.following.length === 0 || !token) return false;
        return data.user.following.some((user: UserProps) => user.id === token.id);
    };

    const formatCategory = (category: string) => {
        return category.charAt(0) + category.slice(1).toLowerCase();
    };

    return (
        <div className="w-full max-w-sm p-4 rounded-lg bg-[var(--background-primary)] border border-[var(--border-color)] hover:bg-[var(--hover)] transition-colors cursor-pointer">
            {/* Avatar and Follow Button */}
            <div className="flex items-start justify-between">
                <Avatar className="w-14 h-14">
                    <AvatarImage
                        src={data.user.photoUrl ? getFullURL(data.user.photoUrl) : "/assets/egg.jpg"}
                        alt={data.user.username}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-[var(--hover)] text-[var(--active-mode)]">
                        {data.user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                {isFollowingTokenOwner() && (
                    <Badge variant="secondary" className="bg-[var(--background-primary)] text-[var(--text-2)] border border-[var(--border-color)] hover:bg-[var(--hover)]">
                        Follows you
                    </Badge>
                )}
            </div>

            {/* Profile Info */}
            <div className="mt-3">
                <h1 className="text-lg font-bold text-[var(--active-mode)] flex items-center gap-1">
                    {data.user.name || data.user.username}
                    {data.user.isPremium && (
                        <BadgeBlue/>
                    )}
                    {data.user.isVip && (
                        <BadgeGold/>
                    )}
                    {data.user.isElite && (
                        <BadgeRed/>
                    )}
                </h1>
                <span className="text-sm text-[var(--text-2)]">@{data.user.username}</span>
            </div>

            {/* Category */}
            {data.user.category && (
                <div className="mt-2">
                    <Badge variant="outline" className="rounded-full text-[9px] text-muted font-normal border-[var(--border-color)] bg-[var(--hover)]">
                        {formatCategory(data.user.category)}
                    </Badge>
                </div>
            )}

            {/* Followers and Following */}
            <div className="mt-4 flex items-center gap-4 text-sm text-[var(--text-2)]">
                <div className="flex items-center gap-1">
                    <span className="font-bold text-[var(--active-mode)]">
                        {data.user.followers.length}
                    </span>
                    <span>Followers</span>
                </div>
                <div>
                    <Follow profile={data.user} />
                </div>
            </div>
        </div>
    );
}