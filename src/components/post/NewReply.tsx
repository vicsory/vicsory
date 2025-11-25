"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Smile } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Replacing Input with Textarea for better UX
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CircularLoading from "../misc/CircularLoading";
import { createReply } from "@/utilities/fetch";
import Uploader from "../misc/Uploader";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import { uploadFile } from "@/utilities/storage";
import { UserProps } from "@/types/UserProps";
import { PostProps } from "@/types/PostProps";
import ProgressCircle from "../misc/ProgressCircle";

interface NewReplyProps {
    token: UserProps;
    post: PostProps;
    onSuccess?: () => void;
}

export default function NewReply({ token, post, onSuccess }: NewReplyProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [count, setCount] = useState(0);

    const queryClient = useQueryClient();
    const queryKey = ["posts", post.author.username, post.id];

    const mutation = useMutation({
        mutationFn: (reply: string) => createReply(reply, post.author.username, post.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            setCount(0);
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (error) => console.error("Error posting reply:", error),
    });

    const handlePhotoChange = (file: File) => {
        setPhotoFile(file);
    };

    const validationSchema = yup.object({
        text: yup
            .string()
            .max(280, "Reply text should be max 280 characters.")
            .required("Reply text can't be empty."),
    });

    const formik = useFormik({
        initialValues: {
            text: "",
            authorId: token.id,
            photoUrl: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                if (photoFile) {
                    const path = await uploadFile(photoFile);
                    if (!path) throw new Error("Error uploading image.");
                    values.photoUrl = path;
                    setPhotoFile(null);
                }
                mutation.mutate(JSON.stringify(values));
                resetForm();
                setShowDropzone(false);
            } catch (error) {
                console.error("Submission error:", error);
            }
        },
    });

    const customHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCount(e.target.value.length);
        formik.handleChange(e);
    };

    if (mutation.isPending) return <CircularLoading />;

    return (
        <div 
            className="p-4"
            style={{ 
                backgroundColor: "var(--background-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
            }}
        >
            <form onSubmit={formik.handleSubmit} className="flex gap-3">
                {/* Avatar */}
                <Link href={`/${token.username}`}>
                    <Avatar className="w-10 h-10 hover:opacity-90 transition-opacity border-2 border-solid border-[var(--border-color)]">
                        <AvatarImage
                            src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
                            alt={token.username}
                        />
                        <AvatarFallback>{token.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Link>

                {/* Form Content */}
                <div className="flex-1 space-y-3">
                    {/* Textarea */}
                    <div className="relative">
                        <Textarea
                            placeholder="Post your reply"
                            name="text"
                            value={formik.values.text}
                            onChange={customHandleChange}
                            className="w-full min-h-[80px] resize-none text-[15px] bg-transparent border border-[var(--border-color)] focus-visible:ring-1 focus-visible:ring-[var(--blue)] focus-visible:border-[var(--blue)] placeholder:text-[var(--text-2)] transition-all duration-200"
                            style={{ color: "var(--active-mode)" }}
                        />
                        {formik.touched.text && formik.errors.text && (
                            <p 
                                className="text-sm mt-1"
                                style={{ color: "var(--red)" }}
                            >
                                {formik.errors.text}
                            </p>
                        )}
                    </div>

                    {/* Reply To */}
                    <Link
                        href={`/${post.author.username}`}
                        className="text-[13px] hover:underline"
                        style={{ color: "var(--text-2)" }}
                    >
                        Replying to{" "}
                        <span style={{ color: "var(--blue)" }}>
                            @{post.author.username}
                        </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDropzone(!showDropzone)}
                                className="h-8 w-8 rounded-full hover:bg-[var(--blue)]/10"
                                style={{ color: "var(--blue)" }}
                            >
                                <Image className="w-5 h-5" />
                            </Button>
                            
                            <Popover open={showPicker} onOpenChange={setShowPicker}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-[var(--blue)]/10"
                                        style={{ color: "var(--blue)" }}
                                    >
                                        <Smile className="w-5 h-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent 
                                    className="w-auto p-0 border-[var(--border-color)]"
                                    style={{ backgroundColor: "var(--background-primary)" }}
                                >
                                    <Picker
                                        data={data}
                                        onEmojiSelect={(emoji: { native: string }) => {
                                            formik.setFieldValue("text", formik.values.text + emoji.native);
                                            setCount((prev) => prev + emoji.native.length);
                                            setShowPicker(false);
                                        }}
                                        previewPosition="none"
                                        theme={document.documentElement.dataset.theme}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex items-center gap-3">
                            <ProgressCircle maxChars={280} count={count} />
                            <Button
                                type="submit"
                                disabled={!formik.isValid || mutation.isPending}
                                className="rounded-full text-sm font-semibold px-4 py-1.5 text-white bg-[var(--blue)] hover:bg-[var(--hover-blue)] transition-colors"
                            >
                                Reply
                            </Button>
                        </div>
                    </div>

                    {/* Dropzone */}
                    {showDropzone && (
                        <div className="mt-2 p-2 rounded-md border border-[var(--border-color)]">
                            <Uploader handlePhotoChange={handlePhotoChange} />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}