import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { UserProps } from "@/types/UserProps"; // Added import
import { getRandomThreeUsers } from "@/utilities/fetch";
import User from "../user/User";

export default function SuggestedUserCardRightBar() {
    const [isOpen, setIsOpen] = useState(true);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["random"],
        queryFn: getRandomThreeUsers,
        enabled: isOpen,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        console.log('WhoToFollow Data:', { data, isLoading, isError, error });
    }, [data, isLoading, isError, error]);

    if (!isOpen) return null;
    if (isLoading) return <div className="p-4 text-[var(--active-mode)]">Loading suggestions...</div>;

    // Type data.users as UserProps[]
    const users = (data?.users || []) as UserProps[];

    return (
        <div
            className="relative flex flex-col bg-[var(--background-primary)] border-[var(--border-color)] border border-solid p-3 rounded-lg text-[var(--active-mode)]"
            style={{ borderRadius: '0.5rem' }}
        >
            <button className="absolute top-1 right-1 text-[var(--active-mode)] hover:bg-[var(--hover)] p-1 rounded-full transition-colors duration-150" onClick={handleClose} aria-label="Close profile reminder"><X size={16} /></button>
            <div className="mb-4">
                <h1 className="text-xl font-semibold tracking-tight">
                    Suggested for You
                </h1>
            </div>
            {data?.success && users.length > 0 ? (
                <div className="space-y-4">
                    {users.map((user, index) => (
                        <div
                            key={user.username || index} // Use username if available
                            className="border-b border-[var(--border-color)] last:border-0 pb-4 last:pb-0"
                        >
                            <User user={user} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm mb-5 leading-relaxed text-[var(--text-2)]">
                    No suggestions available at the moment.
                </p>
            )}
        </div>
    );
}