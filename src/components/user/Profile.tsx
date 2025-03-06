"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaRegEnvelope, FaCheckCircle } from "react-icons/fa";
import { BiCalendarCheck } from "react-icons/bi";
import { GoLocation } from "react-icons/go";
import { AiOutlineLink } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, X, Plus, Music, Laugh, Star, Gamepad, Video, PersonStanding, Building, NotebookPen, Code, Paintbrush, Pen, ChefHat, Plane, Shirt, Vote, School, Dumbbell, Banknote, Baby, Bitcoin, BookOpen, Briefcase, Camera, Car, Clapperboard, DraftingCompass, Gavel, Gift, GraduationCap, Hammer, Home, Joystick, Leaf, Megaphone, Mic, Microscope, PartyPopper, PawPrint, Rocket, Sparkles, Store, Sun, BadgeCheck } from "lucide-react";
import User from "./User";

import { formatDateForProfile } from "@/utilities/date";
import { AuthContext } from "@/app/(vicsory)/layout";
import { UserProps } from "@/types/UserProps";
import PostArrayLength from "../post/PostArrayLength";
import Follow from "./Follow";
import { getFullURL } from "@/utilities/misc/getFullURL";
import PreviewDialog from "../dialog/PreviewDialog";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import NewMessageDialog from "../dialog/NewMessageDialog";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const categoryIcons = {
    NONE: <PersonStanding size={16} color="#9CA3AF" />,
    MUSIC: <Music size={16} color="#9CA3AF" />,
    COMEDY: <Laugh size={16} color="#9CA3AF" />,
    CELEBRITY: <Star size={16} color="#9CA3AF" />,
    GAMER: <Gamepad size={16} color="#9CA3AF" />,
    FILM: <Video size={16} color="#9CA3AF" />,
    INFLUENCER: <Star size={16} color="#9CA3AF" />,
    FREELANCER: <NotebookPen size={16} color="#9CA3AF" />,
    COMPANY: <Building size={16} color="#9CA3AF" />,
    MEDIA: <Video size={16} color="#9CA3AF" />,
    TECH: <Code size={16} color="#9CA3AF" />,
    SPORTS: <Dumbbell size={16} color="#9CA3AF" />,
    ARTIST: <Paintbrush size={16} color="#9CA3AF" />,
    WRITER: <Pen size={16} color="#9CA3AF" />,
    FOOD: <ChefHat size={16} color="#9CA3AF" />,
    TRAVEL: <Plane size={16} color="#9CA3AF" />,
    FASHION: <Shirt size={16} color="#9CA3AF" />,
    POLITICS: <Vote size={16} color="#9CA3AF" />,
    EDUCATION: <School size={16} color="#9CA3AF" />,
    HEALTH: <Dumbbell size={16} color="#9CA3AF" />,
    INVESTOR: <Banknote size={16} color="#9CA3AF" />,
    SCIENTIST: <Microscope size={16} color="#9CA3AF" />,
    ACTIVIST: <Megaphone size={16} color="#9CA3AF" />,
    PHOTOGRAPHER: <Camera size={16} color="#9CA3AF" />,
    PODCASTER: <Mic size={16} color="#9CA3AF" />,
    CRYPTO: <Bitcoin size={16} color="#9CA3AF" />,
    ENTREPRENEUR: <Briefcase size={16} color="#9CA3AF" />,
    PARENTING: <Baby size={16} color="#9CA3AF" />,
    DIY: <Hammer size={16} color="#9CA3AF" />,
    GAMING_DEV: <Joystick size={16} color="#9CA3AF" />,
    HISTORY: <BookOpen size={16} color="#9CA3AF" />,
    NATURE: <Leaf size={16} color="#9CA3AF" />,
    AUTOMOTIVE: <Car size={16} color="#9CA3AF" />,
    SPIRITUAL: <Sun size={16} color="#9CA3AF" />,
    MARKETING: <Megaphone size={16} color="#9CA3AF" />,
    LEGAL: <Gavel size={16} color="#9CA3AF" />,
    ANIMAL: <PawPrint size={16} color="#9CA3AF" />,
    BEAUTY: <Sparkles size={16} color="#9CA3AF" />,
    REAL_ESTATE: <Home size={16} color="#9CA3AF" />,
    EVENT_PLANNER: <PartyPopper size={16} color="#9CA3AF" />,
    CHARITY: <Gift size={16} color="#9CA3AF" />,
    ARCHITECTURE: <DraftingCompass size={16} color="#9CA3AF" />,
    MEMES: <Laugh size={16} color="#9CA3AF" />,
    SPACE: <Rocket size={16} color="#9CA3AF" />,
    VLOGGER: <Clapperboard size={16} color="#9CA3AF" />,
    STUDENT: <GraduationCap size={16} color="#9CA3AF" />,
    RETAIL: <Store size={16} color="#9CA3AF" />,
    OTHER: <PersonStanding size={16} color="#9CA3AF" />,
};

interface ProfileProps {
    profile: UserProps;
}

export default function Profile({ profile }: ProfileProps) {
    const [dialogType, setDialogType] = useState<"followers" | "following" | "">("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
    const [preview, setPreview] = useState({ open: false, url: "" });
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });
    const [isCoursePromptVisible, setIsCoursePromptVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [followingSearchQuery, setFollowingSearchQuery] = useState("");
    const [followersSearchQuery, setFollowersSearchQuery] = useState("");

    const { token } = useContext(AuthContext);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDialogOpen = (type: "followers" | "following") => {
        if (!token) {
            return setSnackbar({ message: `You need to login first to see the ${type}.`, severity: "info", open: true });
        }
        if (type === "following" && profile.following.length === 0) return;
        if (type === "followers" && profile.followers.length === 0) return;

        setDialogType(type);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogType("");
        setIsDialogOpen(false);
        setFollowingSearchQuery("");
        setFollowersSearchQuery("");
    };

    const handleImageClick = (e: any) => {
        const clickedElement = e.target;
        if (clickedElement.alt === "profile-header") {
            handlePreviewClick(profile.headerUrl ? profile.headerUrl : "/assets/header.jpg");
        }
        if (clickedElement.alt === "profile-photo") {
            handlePreviewClick(profile.photoUrl ? profile.photoUrl : "/assets/egg.jpg");
        }
    };

    const handlePreviewClick = (url: string) => {
        setPreview({ open: true, url });
    };

    const handlePreviewClose = () => {
        setPreview({ open: false, url: "" });
    };

    const handleNewMessageClick = () => {
        if (!token) {
            return setSnackbar({ message: "You need to login first to message someone.", severity: "info", open: true });
        }
        setIsNewMessageOpen(true);
    };

    const handleCloseCoursePrompt = () => {
        setIsCoursePromptVisible(false);
    };

    const isFollowingTokenOwner = () => {
        if (profile.following.length === 0 || !token) return false;
        return profile.following.some((user) => typeof user !== "string" && user.id === token.id);
    };

    const formatCategory = (category: string) => {
        return category.charAt(0) + category.slice(1).toLowerCase();
    };

    const firstThreeFollowings = profile.following.filter((user): user is UserProps => typeof user !== "string").slice(0, 3);

    const filteredFollowing = profile.following
        .filter((user): user is UserProps => typeof user !== "string")
        .filter((user) => {
            const name = user.name || ""; // Fallback for null
            const username = user.username || ""; // Fallback for unexpected undefined
            return (
                name.toLowerCase().includes(followingSearchQuery.toLowerCase()) ||
                username.toLowerCase().includes(followingSearchQuery.toLowerCase())
            );
        });

    const filteredFollowers = profile.followers
        .filter((user): user is UserProps => typeof user !== "string")
        .filter((user) => {
            const name = user.name || ""; // Fallback for null
            const username = user.username || ""; // Fallback for unexpected undefined
            return (
                name.toLowerCase().includes(followersSearchQuery.toLowerCase()) ||
                username.toLowerCase().includes(followersSearchQuery.toLowerCase())
            );
        });

    const getActiveTab = () => {
        if (pathname === `/${profile.username}/replies`) return "replies";
        if (pathname === `/${profile.username}/media`) return "media";
        if (pathname === `/${profile.username}/likes`) return "likes";
        return "posts";
    };

    const isOwner = token?.username === profile.username;

    return (
        <div className="w-full max-w-[598px] mx-auto px-0">
            {/* Static top bar */}
            <div className="flex items-center gap-2 py-2 px-4">
                <Link
                    className="border border-solid border-[var(--border-color)] p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors"
                    href="/explore"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex flex-col">
                    <span className="font-bold text-[15px]">{profile.username}</span>
                    <PostArrayLength username={profile.username} />
                </div>
            </div>

            {/* Floating top bar on scroll */}
            <div
                className={`fixed top-0 z-10 w-full max-w-[598px] mx-auto flex items-center gap-2 px-4 py-2 bg-[var(--top-bar-bg)] shadow-md transition-all duration-300 ease-in-out ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}
            >
                <Link
                    className="border border-solid border-[var(--border-color)] p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors"
                    href="/explore"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex flex-col">
                    <span className="font-bold text-[15px]">{profile.username}</span>
                    <PostArrayLength username={profile.username} />
                </div>
            </div>

            <div className="cursor-pointer w-full h-[150px] relative mb-2">
                <Image
                    onClick={handleImageClick}
                    className="object-cover"
                    alt="profile-header"
                    src={profile.headerUrl ? getFullURL(profile.headerUrl) : "/assets/header.jpg"}
                    fill
                />
                <div className="cursor-pointer absolute -bottom-[50px] left-4 border border-solid border-[var(--border-color)] rounded-full p-1 bg-[var(--background-primary)]">
                    <div className="border border-solid border-[var(--border-color)] rounded-full">
                        <Avatar className="w-32 h-32 sm:w-32 sm:h-32 border border-solid border-[var(--border-color)]">
                            <AvatarImage
                                onClick={handleImageClick}
                                src={profile.photoUrl ? getFullURL(profile.photoUrl) : "/assets/egg.jpg"}
                                alt="profile-photo"
                            />
                            <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>

            <div className="mt-[60px] sm:mt-[76px] px-4 flex flex-col gap-2 relative">
                <div className="flex flex-col gap-1">
                    <h1 className="flex items-center gap-2 text-[20px] font-extrabold">
                        {profile.name !== "" ? profile.name : profile.username}
                        {profile.category && profile.category !== "NONE" && (
                            <span>{categoryIcons[profile.category as keyof typeof categoryIcons]}</span>
                        )}
                        {profile.isPremium && (
                            <span data-blue="Verified Blue">
                                <BadgeCheck size={20} fill="#1E90FE" stroke="#fff"/>
                            </span>
                        )}
                    </h1>
                    <div className="text-muted">
                        @{profile.username}
                        {profile.category && profile.category !== "NONE" && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full border border-solid border-[var(--border-color)] hover:border-[var(--border-color)] ml-2 bg-[var(--hover)] text-muted hover:bg-transparent hover:text-muted text-[13px] font-normal"
                                        >
                                            {formatCategory(profile.category)}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="p-2 bg-[var(--background-primary)] rounded-lg shadow-lg">
                                        <p>This user is a {formatCategory(profile.category)} enthusiast</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {isFollowingTokenOwner() && (
                            <span className="text-[13px] font-medium bg-[var(--hover)] text-muted px-2 py-0.5 rounded-lg ml-2">
                                Follows you
                            </span>
                        )}
                    </div>
                </div>
                {profile.description && (
                    <div className="text-[15px] leading-5 break-words">
                        {profile.description}
                    </div>
                )}
                <div className="flex flex-wrap gap-3 text-muted text-[15px]">
                    {profile.location && (
                        <div className="flex items-center gap-2">
                            <GoLocation size={16} /> {profile.location}
                        </div>
                    )}
                    {profile.website && (
                        <div className="flex items-center gap-2">
                            <AiOutlineLink size={16} />{" "}
                            <a className="text-[var(--blue)] hover:underline" href={"https://" + profile.website} target="_blank">
                                {profile.website}
                            </a>
                        </div>
                    )}
                    {profile.whatsapp && (
                        <div className="flex items-center gap-2">
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                alt="WhatsApp"
                                width={16}
                                height={16}
                                className="flex items-center"
                            />
                            <a 
                                className="flex items-center text-[var(--blue)] hover:underline" 
                                href={`https://wa.me/${profile.whatsapp}`} 
                                target="_blank"
                            >
                                {profile.whatsapp}
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <BiCalendarCheck size={16} /> Joined {formatDateForProfile(new Date(profile.createdAt))}
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[15px]">
                    <div
                        onClick={() => handleDialogOpen("followers")}
                        className="cursor-pointer hover:underline"
                    >
                        <span className="font-bold">{profile.followers.length}</span>{" "}
                        <span className="text-muted">Followers</span>
                    </div>
                    <div
                        onClick={() => handleDialogOpen("following")}
                        className="cursor-pointer hover:underline flex items-center gap-2"
                    >
                        <div className="flex -space-x-1 sm:-space-x-2 items-center">
                            {firstThreeFollowings.map((user) => (
                                <Avatar key={typeof user === "string" ? user : user.id} className="w-6 h-6 sm:w-8 sm:h-8 border border-solid border-[var(--border-color)]">
                                    <AvatarImage
                                        src={typeof user !== "string" && user.photoUrl ? getFullURL(user.photoUrl) : "/assets/egg.jpg"}
                                        alt={typeof user === "string" ? user : user.username}
                                    />
                                    <AvatarFallback>{typeof user === "string" ? (user as string).charAt(0) : user.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                            {profile.following.length > 3 && (
                                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-[var(--hover)] rounded-full border border-solid border-[var(--border-color)]">
                                    <Plus className="w-4 h-4 text-muted" />
                                </div>
                            )}
                        </div>   
                        <span className="text-muted">Following</span>
                    </div>
                </div>
                <div className="absolute -top-[50px] sm:-top-[70px] right-4 flex gap-2 items-center">
                    {token?.username === profile.username ? (
                        <Link
                            href={`/${profile.username}/edit`}
                            className="font-bold text-[15px] py-1 px-3 rounded-full border border-solid border-[var(--border-color)] hover:bg-[var(--hover)] transition-colors"
                        >
                            Edit profile
                        </Link>
                    ) : (
                        <>
                            <button
                                className="border border-solid border-[var(--twitter-light-gray)] p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors"
                                onClick={handleNewMessageClick}
                            >
                                <FaRegEnvelope className="w-4 h-4" />
                            </button>
                            <Follow profile={profile} />
                        </>
                    )}
                </div>
                {token?.username === profile.username && isCoursePromptVisible && (
                    <div className="relative p-4 border border-solid border-gray-200 bg-[var(--yellow)] mt-2 rounded-xl">
                        <button
                            onClick={handleCloseCoursePrompt}
                            className="absolute top-2 right-2 text-black hover:bg-[var(--hover-yellow)] rounded-full p-1 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col items-start gap-2">
                            <h2 className="text-[18px] font-bold text-black">Start Teaching Today</h2>
                            <p className="text-[14px] text-black leading-[18px]">
                                You haven’t created any courses yet. Share your knowledge with the community by
                                creating your first course now!
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <Link
                                    href="/school"
                                    className="px-3 py-1 text-[14px] font-bold text-white hover:border-transparent bg-[var(--blue)] border border-solid border-black rounded-full hover:bg-[var(--hover-blue)] transition-colors"
                                >
                                    Create Course
                                </Link>
                                {!profile.isPremium && (
                                    <Link
                                        href="/verify"
                                        className="flex items-center hover:border-transparent px-3 gap-1 py-1 text-[14px] font-semibold hover:bg-[var(--hover-blue)] border border-solid border-black text-black hover:text-white bg-transparent rounded-full transition-colors"
                                    >
                                        <BadgeCheck className="w-4 h-4" fill="#1E90FE" stroke="#fff"/>
                                        Get Verified Now!
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Navigation */}
            <Tabs defaultValue={getActiveTab()} className="w-full mt-2">
                <TabsList className="w-full flex justify-around border-b border-solid border-[var(--border-color)] bg-transparent">
                    <TabsTrigger
                        value="posts"
                        className="text-[15px] flex items-center justify-center text-[var(--twitter-muted)] w-full font-bold py-3 relative hover:bg-[var(--hover)] transition-colors duration-100 group data-[state=active]:text-[var(--twitter-black)]"
                        asChild
                    >
                        <Link href={`/${profile.username}`} className="relative z-10">
                            <span>Posts</span>
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--twitter-blue)] transition-colors duration-100"></span>
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger
                        value="replies"
                        className="text-[15px] flex items-center justify-center text-[var(--twitter-muted)] w-full font-bold py-3 relative hover:bg-[var(--hover)] transition-colors duration-100 group data-[state=active]:text-[var(--twitter-black)]"
                        asChild
                    >
                        <Link href={`/${profile.username}/replies`} className="relative z-10">
                            <span>Replies</span>
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--twitter-blue)] transition-colors duration-100"></span>
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger
                        value="media"
                        className="text-[15px] flex items-center justify-center text-[var(--twitter-muted)] w-full font-bold py-3 relative hover:bg-[var(--hover)] transition-colors duration-100 group data-[state=active]:text-[var(--twitter-black)]"
                        asChild
                    >
                        <Link href={`/${profile.username}/media`} className="relative z-10">
                            <span>Media</span>
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--twitter-blue)] transition-colors duration-100"></span>
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger
                        value="likes"
                        className="text-[15px] flex items-center justify-center text-[var(--twitter-muted)] w-full font-bold py-3 relative hover:bg-[var(--hover)] transition-colors duration-100 group data-[state=active]:text-[var(--twitter-black)]"
                        asChild
                    >
                        <Link href={`/${profile.username}/likes`} className="relative z-10">
                            <span>Likes</span>
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--twitter-blue)] transition-colors duration-100"></span>
                        </Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {isDialogOpen && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-md p-4 bg-[var(--background-primary)] rounded-lg shadow-lg">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-[var(--twitter-black)]">
                                {dialogType === "following" ? "Following" : "Followers"}
                                {dialogType === "following" && isOwner && (
                                    <span className="ml-2 text-sm text-[var(--twitter-muted)]">
                                        ({filteredFollowing.length})
                                    </span>
                                )}
                            </DialogTitle>
                        </DialogHeader>
                        <Input
                            type="text"
                            placeholder={`Search ${dialogType}...`}
                            value={dialogType === "following" ? followingSearchQuery : followersSearchQuery}
                            onChange={(e) => dialogType === "following" 
                                ? setFollowingSearchQuery(e.target.value) 
                                : setFollowersSearchQuery(e.target.value)}
                            className="mb-4 w-full rounded-md border border-solid border-[var(--border-color)] px-3 py-2 text-[15px] text-[var(--twitter-black)] placeholder:text-[var(--twitter-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--twitter-blue)]"
                        />
                        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                            {dialogType === "following"
                                ? (filteredFollowing.length > 0 ? (
                                    filteredFollowing.map((user) => (
                                        <div className="p-2 hover:bg-[var(--hover)] rounded-md transition-colors" key={"following" + user.id}>
                                            <User user={user} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[var(--twitter-muted)] text-[15px]">
                                        {followingSearchQuery ? "No matching users found." : "No users followed yet."}
                                    </p>
                                ))
                                : (filteredFollowers.length > 0 ? (
                                    filteredFollowers.map((user) => (
                                        <div className="p-2 hover:bg-[var(--hover)] rounded-md transition-colors" key={"followers" + user.id}>
                                            <User user={user} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[var(--twitter-muted)] text-[15px]">
                                        {followersSearchQuery ? "No matching users found." : "No followers yet."}
                                    </p>
                                ))}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <PreviewDialog open={preview.open} handlePreviewClose={handlePreviewClose} url={preview.url} />
            {token && isNewMessageOpen && (
                <NewMessageDialog
                    handleNewMessageClose={() => setIsNewMessageOpen(false)}
                    open={isNewMessageOpen}
                    token={token}
                    recipient={profile.username}
                />
            )}
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
        </div>
    );
}