"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegImage, FaRegSmile } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import CircularLoading from "../misc/CircularLoading";
import { createPost } from "@/utilities/fetch";
import { NewPostProps } from "@/types/PostProps";
import Uploader from "../misc/Uploader";
import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
import { uploadFile } from "@/utilities/storage";
import ProgressCircle from "../misc/ProgressCircle";
import Image from "next/image";

export default function NewPost({ token, handleSubmit }: NewPostProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [count, setCount] = useState(0);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
        onError: (error) => console.log(error),
    });

    const handlePhotoChange = (file: File) => setPhotoFile(file);

    const validationSchema = yup.object({
        text: yup
            .string()
            .max(280, "Post text should be maximum 280 characters.")
            .required("Post text can't be empty."),
    });

    const tokenData = typeof token === "string" ? JSON.parse(token) : token;

    const formik = useFormik({
        initialValues: {
            text: "",
            authorId: tokenData.id,
            photoUrl: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (photoFile) {
                const path: string | void = await uploadFile(photoFile);
                if (!path) throw new Error("Error uploading image.");
                values.photoUrl = path;
                setPhotoFile(null);
            }
            mutation.mutate(JSON.stringify(values));
            resetForm();
            setCount(0);
            setShowDropzone(false);
            if (handleSubmit) handleSubmit();
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCount(e.target.value.length);
        formik.handleChange(e);
    };

    if (formik.isSubmitting) return <CircularLoading />;

    return (
        <div className="w-full max-w-xl mx-auto p-4 rounded-lg shadow-md space-y-3 border border-solid bg-[var(--background-primary)]/80 backdrop-blur-xl border-[var(--border-color)]">
            {/* Avatar + Textarea */}
            <div className="flex space-x-3 ">
                <Image
                    src={tokenData.photoUrl ? getFullURL(tokenData.photoUrl) : "/assets/egg.jpg"}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                    width={75}
                    height={75}
                />
                <textarea
                    name="text"
                    value={formik.values.text}
                    onChange={handleChange}
                    placeholder="What's happening?"
                    className="bg-[var(--hover)] flex-1 resize-none border border-solid border-[var(--border-color)] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                    rows={3}
                />
            </div>

            {/* Buttons + Progress + Submit */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowDropzone(true)}
                        className="text-white hover:text-[var(--hover-grey)] p-2 rounded-full hover:bg-[var(--hover)] transition"
                    >
                        <FaRegImage size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowPicker(!showPicker)}
                        className="text-white hover:text-[var(--hover-grey)] p-2 rounded-full hover:bg-[var(--hover)] transition"
                    >
                        <FaRegSmile size={20} />
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <ProgressCircle count={count} maxChars={280} />
                    <button
                        type="submit"
                        onClick={() => formik.handleSubmit()}
                        disabled={!formik.isValid || !formik.dirty}
                        className={`px-4 py-1 rounded-md ${formik.isValid && formik.dirty
                            ? "bg-[var(--blue)] hover:bg-[var(--hover-blue)] text-white"
                            : "bg-[var(--hover)] cursor-not-allowed text-[var(--active-mode)]"
                            }`}
                    >
                        Post
                    </button>
                </div>
            </div>

            {/* Emoji Picker */}
            {showPicker && (
                <div className="mt-2">
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                            formik.setFieldValue("text", formik.values.text + emoji.native);
                            setCount(count + emoji.native.length);
                            setShowPicker(false);
                        }}
                        previewPosition="none"
                    />
                </div>
            )}

            {/* Dropzone */}
            {showDropzone && <Uploader handlePhotoChange={handlePhotoChange} />}
        </div>
    );
}
