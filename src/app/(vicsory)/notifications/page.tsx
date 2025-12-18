"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { getNotifications, markNotificationsRead } from "@/utilities/fetch";
import CircularLoading from "@/components/misc/CircularLoading";
import NothingToShow from "@/components/misc/NothingToShow";
import { NotificationProps } from "@/types/NotificationProps";
import Notification from "@/components/misc/Notification";
import { AuthContext } from "@/contexts/auth-context";

export default function NotificationsPage() {
    const { token, isPending } = useContext(AuthContext);

    const queryClient = useQueryClient();

    const { isLoading, data, isFetched } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const mutation = useMutation({
        mutationFn: markNotificationsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
        onError: (error) => console.log(error),
    });

    const handleNotificationsRead = () => {
        mutation.mutate();
    };

    useEffect(() => {
        if (isFetched && data.notifications.filter((notification: NotificationProps) => !notification.isRead).length > 0) {
            const countdownForMarkAsRead = setTimeout(() => {
                handleNotificationsRead();
            }, 1000);

            return () => {
                clearTimeout(countdownForMarkAsRead);
            };
        }
    }, []);

    if (isPending || !token || isLoading) return <CircularLoading />;

    return (
        <main className="min-h-screen bg-[var(--background-primary)]">
            <h1 className="flex items-center p-4 text-xl text-[var(--text)] font-bold border-solid border-b border-[var(--border)]">Notifications</h1>
            {isFetched && data.notifications.length === 0 ? (
                <NothingToShow />
            ) : (
                <div className="w-full flex flex-col">
                    {data.notifications.map((notification: NotificationProps) => (
                        <Notification key={notification.id} notification={notification} token={token} />
                    ))}
                </div>
            )}
        </main>
    );
}
