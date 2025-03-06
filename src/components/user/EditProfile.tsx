import { useRef, useState } from "react";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Music, Laugh, Star, Gamepad, Video, PersonStanding, Building, NotebookPen, Code, Paintbrush, Pen, ChefHat, Plane, Shirt, Vote, School, Dumbbell, Banknote, Microscope, Megaphone, Camera as CameraIcon, Mic, Bitcoin, Briefcase, Baby, Hammer, Joystick, BookOpen, Leaf, Car, Sun, Megaphone as MegaphoneIcon, Gavel, PawPrint, Sparkles, Home, PartyPopper, Gift, Laugh as LaughIcon, Rocket, Clapperboard, GraduationCap, Store, DraftingCompass, DumbbellIcon, BadgeCheck } from "lucide-react";
import * as yup from "yup";
import Image from "next/image";

import { UserProps } from "@/types/UserProps";
import { uploadFile } from "@/utilities/storage";
import { editUser } from "@/utilities/fetch";
import { getFullURL } from "@/utilities/misc/getFullURL";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import { checkBlueFromServer } from "@/utilities/misc/checkBlue";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const categoryOptions = [
    { value: "NONE", label: "None", icon: <PersonStanding size={20} color="#9CA3AF" /> },
    { value: "MUSIC", label: "Music", icon: <Music size={20} color="#9CA3AF" /> },
    { value: "COMEDY", label: "Comedy", icon: <Laugh size={20} color="#9CA3AF" /> },
    { value: "CELEBRITY", label: "Celebrity", icon: <Star size={20} color="#9CA3AF" /> },
    { value: "GAMER", label: "Gamer", icon: <Gamepad size={20} color="#9CA3AF" /> },
    { value: "FILM", label: "Film", icon: <Video size={20} color="#9CA3AF" /> },
    { value: "INFLUENCER", label: "Influencer", icon: <Star size={20} color="#9CA3AF" /> },
    { value: "FREELANCER", label: "Freelancer", icon: <NotebookPen size={20} color="#9CA3AF" /> },
    { value: "COMPANY", label: "Company", icon: <Building size={20} color="#9CA3AF" /> },
    { value: "MEDIA", label: "Media", icon: <Video size={20} color="#9CA3AF" /> },
    { value: "TECH", label: "Tech", icon: <Code size={20} color="#9CA3AF" /> },
    { value: "SPORTS", label: "Sports", icon: <DumbbellIcon size={20} color="#9CA3AF" /> },
    { value: "ARTIST", label: "Artist", icon: <Paintbrush size={20} color="#9CA3AF" /> },
    { value: "WRITER", label: "Writer", icon: <Pen size={20} color="#9CA3AF" /> },
    { value: "FOOD", label: "Food", icon: <ChefHat size={20} color="#9CA3AF" /> },
    { value: "TRAVEL", label: "Travel", icon: <Plane size={20} color="#9CA3AF" /> },
    { value: "FASHION", label: "Fashion", icon: <Shirt size={20} color="#9CA3AF" /> },
    { value: "POLITICS", label: "Politics", icon: <Vote size={20} color="#9CA3AF" /> },
    { value: "EDUCATION", label: "Education", icon: <School size={20} color="#9CA3AF" /> },
    { value: "HEALTH", label: "Health", icon: <Dumbbell size={20} color="#9CA3AF" /> },
    { value: "INVESTOR", label: "Investor", icon: <Banknote size={20} color="#9CA3AF" /> },
    { value: "SCIENTIST", label: "Scientist", icon: <Microscope size={20} color="#9CA3AF" /> },
    { value: "ACTIVIST", label: "Activist", icon: <Megaphone size={20} color="#9CA3AF" /> },
    { value: "PHOTOGRAPHER", label: "Photographer", icon: <CameraIcon size={20} color="#9CA3AF" /> },
    { value: "PODCASTER", label: "Podcaster", icon: <Mic size={20} color="#9CA3AF" /> },
    { value: "CRYPTO", label: "Crypto", icon: <Bitcoin size={20} color="#9CA3AF" /> },
    { value: "ENTREPRENEUR", label: "Entrepreneur", icon: <Briefcase size={20} color="#9CA3AF" /> },
    { value: "PARENTING", label: "Parenting", icon: <Baby size={20} color="#9CA3AF" /> },
    { value: "DIY", label: "DIY", icon: <Hammer size={20} color="#9CA3AF" /> },
    { value: "GAMING_DEV", label: "Gaming Developer", icon: <Joystick size={20} color="#9CA3AF" /> },
    { value: "HISTORY", label: "History", icon: <BookOpen size={20} color="#9CA3AF" /> },
    { value: "NATURE", label: "Nature", icon: <Leaf size={20} color="#9CA3AF" /> },
    { value: "AUTOMOTIVE", label: "Automotive", icon: <Car size={20} color="#9CA3AF" /> },
    { value: "SPIRITUAL", label: "Spiritual", icon: <Sun size={20} color="#9CA3AF" /> },
    { value: "MARKETING", label: "Marketing", icon: <MegaphoneIcon size={20} color="#9CA3AF" /> },
    { value: "LEGAL", label: "Legal", icon: <Gavel size={20} color="#9CA3AF" /> },
    { value: "ANIMAL", label: "Animal", icon: <PawPrint size={20} color="#9CA3AF" /> },
    { value: "BEAUTY", label: "Beauty", icon: <Sparkles size={20} color="#9CA3AF" /> },
    { value: "REAL_ESTATE", label: "Real Estate", icon: <Home size={20} color="#9CA3AF" /> },
    { value: "EVENT_PLANNER", label: "Event Planner", icon: <PartyPopper size={20} color="#9CA3AF" /> },
    { value: "CHARITY", label: "Charity", icon: <Gift size={20} color="#9CA3AF" /> },
    { value: "ARCHITECTURE", label: "Architecture", icon: <DraftingCompass size={20} color="#9CA3AF" /> },
    { value: "MEMES", label: "Memes", icon: <LaughIcon size={20} color="#9CA3AF" /> },
    { value: "SPACE", label: "Space", icon: <Rocket size={20} color="#9CA3AF" /> },
    { value: "VLOGGER", label: "Vlogger", icon: <Clapperboard size={20} color="#9CA3AF" /> },
    { value: "STUDENT", label: "Student", icon: <GraduationCap size={20} color="#9CA3AF" /> },
    { value: "RETAIL", label: "Retail", icon: <Store size={20} color="#9CA3AF" /> },
    { value: "OTHER", label: "Other", icon: <PersonStanding size={20} color="#9CA3AF" /> },
];

export default function EditProfile({ profile, refreshToken }: { profile: UserProps; refreshToken: () => void }) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [headerPreview, setHeaderPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [headerFile, setHeaderFile] = useState<File | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });
    const [isBlueOpen, setIsBlueOpen] = useState(false);
    const [blueInput, setBlueInput] = useState("");
    const [isBlueLoading, setIsBlueLoading] = useState(false);

    const headerUploadInputRef = useRef<HTMLInputElement>(null);
    const photoUploadInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setHeaderPreview(URL.createObjectURL(file));
            setHeaderFile(file);
        }
    };

    const handleHeaderClick = () => {
        headerUploadInputRef.current?.click();
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
            setPhotoFile(file);
        }
    };

    const handlePhotoClick = () => {
        photoUploadInputRef.current?.click();
    };

    const validationSchema = yup.object({
        name: yup.string().max(50, "Name should be of maximum 50 characters length.").required("Name is required"),
        description: yup.string().max(160, "Description should be of maximum 160 characters length."),
        location: yup.string().max(30, "Location should be of maximum 30 characters length."),
        website: yup.string().max(100, "Website should be of maximum 100 characters length."),
        photoUrl: yup.string(),
        headerUrl: yup.string(),
        category: yup.string().oneOf(categoryOptions.map(opt => opt.value)).required("Category is required"),
        whatsapp: yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
        .max(15, "WhatsApp number should be maximum 15 characters"),
    });

    const formik = useFormik({
        initialValues: {
            name: profile.name ?? "",
            description: profile.description ?? "",
            location: profile.location ?? "",
            website: profile.website ?? "",
            whatsapp: profile.whatsapp ?? "",
            headerUrl: profile.headerUrl ?? "",
            photoUrl: profile.photoUrl ?? "",
            category: profile.category ?? "NONE",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const updatedValues = { ...values };
            if (headerFile) {
                const headerPath = await uploadFile(headerFile);
                if (!headerPath) throw new Error("Header upload failed.");
                updatedValues.headerUrl = headerPath;
            }
            if (photoFile) {
                const photoPath = await uploadFile(photoFile);
                if (!photoPath) throw new Error("Photo upload failed.");
                updatedValues.photoUrl = photoPath;
            }

                const response = await editUser(JSON.stringify(updatedValues), profile.username);
                if (!response || !response.success) {
                    throw new Error(response?.message || "Server returned unsuccessful response");
                }

                setSnackbar({
                    message: "Your profile has been updated successfully.",
                    severity: "success",
                    open: true,
                });
                refreshToken();
                queryClient.invalidateQueries({ queryKey: ["users", profile.username] });
            } catch (error) {
                setSnackbar({
                    message: error instanceof Error ? error.message : "Something went wrong while updating profile.",
                    severity: "error",
                    open: true,
                });
            }
        },
    });

    const handleBlueSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (blueInput === "") return;
        setIsBlueLoading(true);
        try {
            const checkResponse = await checkBlueFromServer(blueInput);
            if (!checkResponse) throw new Error("Invalid blue code.");
            const response = await editUser(JSON.stringify({ isPremium: true }), profile.username);
            if (!response.success) throw new Error("Server error while updating blue status.");
            setSnackbar({
                message: "You got your blue successfully. Congrats!",
                severity: "success",
                open: true,
            });
            setIsBlueOpen(false);
            refreshToken();
            queryClient.invalidateQueries({ queryKey: ["users", profile.username] });
        } catch (error) {
            setSnackbar({
                message: error instanceof Error ? error.message : "Something went wrong while getting your blue.",
                severity: "error",
                open: true,
            });
        } finally {
            setIsBlueLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="relative h-52 bg-[var(--grey)]">
                <Image
                    alt="Header"
                    src={
                        headerPreview
                            ? headerPreview
                            : profile.headerUrl
                            ? getFullURL(profile.headerUrl)
                            : "/assets/header.jpg"
                    }
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                        variant="outline"
                        className="absolute inset-0 m-auto w-12 h-12 bg-black/30 hover:bg-[var(--hover)] border-[var(--border-color)] rounded-full"
                        onClick={handleHeaderClick}
                    >
                        <Camera size={20} color="var(--active-mode)" />
                    </Button>
                    <input
                        ref={headerUploadInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleHeaderChange}
                        accept="image/*"
                    />
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-16 left-6">
                    <Avatar className="w-32 h-32 border-4 border-[var(--background-primary)] relative">
                        <AvatarImage
                            src={
                                photoPreview
                                    ? photoPreview
                                    : profile.photoUrl
                                    ? getFullURL(profile.photoUrl)
                                    : "/assets/egg.jpg"
                            }
                            alt="Profile"
                        />
                        <Button
                            variant="outline"
                            className="absolute inset-0 m-auto w-12 h-12 bg-black/30 hover:bg-[var(--hover)] border-[var(--border-color)] rounded-full"
                            onClick={handlePhotoClick}
                        >
                            <Camera size={20} color="var(--active-mode)" />
                        </Button>
                        <input
                            ref={photoUploadInputRef}
                            type="file"
                            className="hidden"
                            onChange={handlePhotoChange}
                            accept="image/*"
                        />
                    </Avatar>
                </div>
            </div>

            {/* Form Section */}
            <div className="mt-20 px-6 pb-6 bg-[var(--background-primary)] rounded-b-lg border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6 pt-6">
                    <h1 className="text-2xl font-bold text-[var(--active-mode)]">Edit Profile</h1>
                    <Button
                        variant="ghost"
                        className="text-[var(--blue)] hover:text-[var(--hover-blue)]"
                        onClick={() => setIsBlueOpen(true)}
                    >
                        <BadgeCheck size={18} className="ml-2" fill="#1E90FE" stroke="#fff"/>Get Verified Now! 
                    </Button>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <div className="relative">
                            <Input
                                name="name"
                                placeholder="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${
                                    formik.touched.name && formik.errors.name ? "border-[var(--red)]" : ""
                                }`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                {categoryOptions.find(opt => opt.value === formik.values.category)?.icon}
                            </span>
                        </div>
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-[var(--red)] text-sm">{formik.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Textarea
                            name="description"
                            placeholder="Bio"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            className={`w-full bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)] focus:outline-none focus:border-[var(--blue)] focus:border-2 min-h-[100px] ${
                                formik.touched.description && formik.errors.description ? "border-[var(--red)]" : ""
                            }`}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-[var(--red)] text-sm">{formik.errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Input
                                name="location"
                                placeholder="Location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)] focus:outline-none focus:border-[var(--blue)] focus:border-2${
                                    formik.touched.location && formik.errors.location ? "border-[var(--red)]" : ""
                                }`}
                            />
                            {formik.touched.location && formik.errors.location && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.location}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Input
                                name="website"
                                placeholder="Website"
                                value={formik.values.website}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${
                                    formik.touched.website && formik.errors.website ? "border-[var(--red)]" : ""
                                }`}
                            />
                            {formik.touched.website && formik.errors.website && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.website}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <Input
                                name="whatsapp"
                                placeholder="WhatsApp Number (e.g., +1234567890)"
                                value={formik.values.whatsapp}
                                onChange={formik.handleChange}
                                className={`w-full bg-green-50 border-green-500 text-green-900 hover:bg-green-100 focus:outline-none focus:border-green-600 focus:border-2 pl-10 ${
                                    formik.touched.whatsapp && formik.errors.whatsapp ? "border-[var(--red)]" : ""
                                }`}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                    alt="WhatsApp"
                                    width={20}
                                    height={20}
                                />
                            </span>
                        </div>
                        {formik.touched.whatsapp && formik.errors.whatsapp && (
                            <p className="text-[var(--red)] text-sm">{formik.errors.whatsapp}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Select
                            name="category"
                            value={formik.values.category}
                            onValueChange={(value) => formik.setFieldValue("category", value)}
                        >
                            <SelectTrigger className="w-full bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)] focus:ring-[var(--blue)]">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] max-h-60 overflow-y-auto">
                                {categoryOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                                        <span className="flex items-center gap-2">
                                            {option.icon}
                                            {option.label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formik.touched.category && formik.errors.category && (
                            <p className="text-[var(--red)] text-sm">{formik.errors.category}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!formik.isValid || !formik.dirty}
                        className={`w-full bg-[var(--blue)] text-white hover:bg-[var(--hover-blue)] disabled:bg-[var(--grey)] disabled:text-gray-500 disabled:cursor-not-allowed`}
                    >
                        {formik.isSubmitting ? <p className="text-sm">loading...</p> : "Save Changes"}
                    </Button>
                </form>
            </div>

            {/* Snackbar */}
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}

            {/* Blue Modal */}
            {isBlueOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-[var(--background-primary)] rounded-xl p-6 max-w-md w-full border border-[var(--border-color)] shadow-xl">
                        {profile.isPremium ? (
                            <div className="text-center space-y-4">
                                <Image src="/assets/favicon.png" alt="Logo" width={75} height={75} className="mx-auto" />
                                <p className="text-[var(--active-mode)]/80">{"You're Already Blue!"}</p>
                                <p className="text-[var(--active-mode)]/80">Thank you for being a premium member.</p>
                                <Button
                                    variant="outline"
                                    className="w-full border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)]"
                                    onClick={() => setIsBlueOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-[var(--active-mode)] flex items-center gap-2">
                                    Get Vicsory Blue <BadgeCheck size={20} fill="#1E90FE" stroke="#fff" />
                                </h2>
                                <p className="text-[var(--active-mode)]/80">
                                    Unlock the blue bird next to your name with Vicsory Blue subscription!
                                </p>
                                <p className="text-[var(--active-mode)]/80">
                                    Find the code on{" "}
                                    <a
                                        href="https://x.com/VicsoryApp"
                                        target="_blank"
                                        className="text-[var(--blue)] hover:text-[var(--hover-blue)]"
                                    >
                                        x.com
                                    </a>
                                </p>
                                <form onSubmit={handleBlueSubmit} className="space-y-4">
                                    <Input
                                        type="text"
                                        value={blueInput}
                                        onChange={(e) => setBlueInput(e.target.value)}
                                        placeholder="Enter your code"
                                        className="w-full bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)] focus:ring-[var(--blue)]"
                                        autoFocus
                                    />
                                    <div className="flex items-center justify-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)]"
                                            onClick={() => setIsBlueOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex items-center justify-center bg-[var(--blue)] text-white hover:bg-[var(--hover-blue)] disabled:bg-[var(--grey)]"
                                            disabled={isBlueLoading}
                                        >
                                            {isBlueLoading ? <p className="text-sm">loading...</p> : "Submit"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}