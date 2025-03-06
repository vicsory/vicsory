"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getNotifications } from "@/utilities/fetch";
import { NotificationProps } from "@/types/NotificationProps";
import { usePathname } from "next/navigation";

export default function UnreadNotificationsBadge() {
    const pathname = usePathname();
    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const lengthOfUnreadNotifications =
        data?.notifications?.filter((notification: NotificationProps) => !notification.isRead)?.length ?? 0;

    // Animation variants with a subtle bounce effect
    const animationVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 },
        },
    };

    if (lengthOfUnreadNotifications === 0) return null;

    return (
        <motion.span
            className={`
                absolute -top-1 -right-[2px]
                flex items-center justify-center
                min-w-[18px] h-[18px]
                ${pathname.startsWith("/notifications")
                    ? "bg-green-600 ring-2 ring-white"
                    : "bg-green-500"
                }
                text-white text-xs font-medium
                rounded-full
                ${lengthOfUnreadNotifications > 99 ? "min-w-[24px] h-[24px] text-sm" : ""}
            `}
            variants={animationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            // Add a key to force re-animation when count changes
            key={lengthOfUnreadNotifications}
        >
            {lengthOfUnreadNotifications > 99 ? "99+" : lengthOfUnreadNotifications}
        </motion.span>
    );
}