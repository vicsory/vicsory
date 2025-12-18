import { formatDistanceToNowStrict } from "date-fns";

export const formatDate = (date: Date) => {
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((Date.now() - postDate.getTime()) / 1000);

    if (diffInSeconds > 86400) {
        // (24 hours)
        const formattedDate = postDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
        });
        return formattedDate;
    }

    const timeDistance = formatDistanceToNowStrict(postDate);
    return timeDistance;
};

export const formatDateExtended = (date: Date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
};

export const formatDateForProfile = (date: Date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString("en-us", {
        year: "numeric",
        month: "long",
    });
};
