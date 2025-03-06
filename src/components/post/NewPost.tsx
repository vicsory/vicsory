"use client";

import { useState } from "react";
import { TextField, Avatar } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegImage, FaRegSmile, FaCode } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import CircularLoading from "../misc/CircularLoading";
import { createPost } from "@/utilities/fetch";
import { NewPostProps } from "@/types/PostProps";
import Uploader from "../misc/Uploader";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { uploadFile } from "@/utilities/storage";
import ProgressCircle from "../misc/ProgressCircle";
import CodeShare from "./ShareCode";

interface FormValues {
    text: string;
    authorId: string;
    photoUrl: string;
}

interface Emoji {
    native: string;
}

export default function NewPost({ token, handleSubmit }: NewPostProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const [showCodeShare, setShowCodeShare] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [count, setCount] = useState(0);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => console.log(error),
    });

    const handlePhotoChange = (file: File) => {
        setPhotoFile(file);
    };

    const validationSchema = yup.object({
        text: yup
            .string()
            .max(280, "Post text should be of maximum 280 characters length.")
            .required("Post text can't be empty."),
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            text: "",
            authorId: token.id,
            photoUrl: "",
        },
        validationSchema: validationSchema,
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
                setCount(0);
                setShowDropzone(false);
                if (handleSubmit) handleSubmit();
            } catch (error) {
                console.error("Error submitting post:", error);
            }
        },
    });

    const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCount(e.target.value.length);
        formik.handleChange(e);
    };

    const handleCodeSubmit = (code: string) => {
        // Handle code submission here
        console.log("Code submitted:", code);
        setShowCodeShare(false);
    };

    if (mutation.isPending || formik.isSubmitting) {
        return <CircularLoading />;
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 bg-[var(--background-primary)] rounded-lg border border-solid border-[var(--border-color)]">
            <div className="flex items-start gap-4">
                <Avatar
                    className="avatar div-link"
                    sx={{ width: 50, height: 50 }}
                    alt=""
                    src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
                />
                {showCodeShare ? (
                    <CodeShare onCodeSubmit={handleCodeSubmit} />
                ) : (
                    <form onSubmit={formik.handleSubmit} className="flex-1">
                        <div className="mb-4">
                            <TextField
                                placeholder="What's happening?"
                                multiline
                                hiddenLabel
                                minRows={3}
                                variant="standard"
                                fullWidth
                                name="text"
                                value={formik.values.text}
                                onChange={customHandleChange}
                                error={formik.touched.text && Boolean(formik.errors.text)}
                                helperText={formik.touched.text && formik.errors.text}
                                className="w-full"
                                InputProps={{
                                    disableUnderline: true,
                                    className: "text-[var(--active-mode)] placeholder-gray-400"
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowDropzone(true)}
                                    className="text-[var(--blue)] hover:text-[var(--hover-blue)] transition-colors p-2 rounded-full hover:bg-[var(--hover)]"
                                >
                                    <FaRegImage size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPicker(!showPicker)}
                                    className="text-[var(--blue)] hover:text-[var(--hover-blue)] transition-colors p-2 rounded-full hover:bg-[var(--hover)]"
                                >
                                    <FaRegSmile size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCodeShare(true)}
                                    className="text-[var(--blue)] hover:text-[var(--hover-blue)] transition-colors p-2 rounded-full hover:bg-[var(--hover)]"
                                >
                                    <FaCode size={20} />
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <ProgressCircle maxChars={280} count={count} />
                                <button
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-colors ${
                                        formik.values.text.length > 0 && formik.isValid
                                            ? 'bg-[var(--blue)] hover:bg-[var(--hover-blue)]'
                                            : 'bg-[var(--grey)] cursor-not-allowed text-muted'
                                    }`}
                                    disabled={!(formik.values.text.length > 0 && formik.isValid)}
                                    type="submit"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                        {showPicker && (
                            <div className="mt-2 relative">
                                <Picker
                                    data={data}
                                    onEmojiSelect={(emoji: Emoji) => {
                                        formik.setFieldValue("text", formik.values.text + emoji.native);
                                        setShowPicker(false);
                                        setCount(count + emoji.native.length);
                                    }}
                                    previewPosition="none"
                                    className="absolute z-10"
                                />
                            </div>
                        )}
                        {showDropzone && (
                            <div className="mt-4">
                                <Uploader handlePhotoChange={handlePhotoChange} />
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}