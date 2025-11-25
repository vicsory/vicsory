"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { FaRegImage, FaRegSmile } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { NewMessageDialogProps } from "@/types/DialogProps";
import { checkUserExists, createMessage } from "@/utilities/fetch";
import { uploadFile } from "@/utilities/storage";
import CircularLoading from "../misc/CircularLoading";
import Uploader from "../misc/Uploader";

interface LocalEmoji {
    native: string;
}

export default function NewMessageDialog({ open, handleNewMessageClose, token, recipient = "" }: NewMessageDialogProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages", token.username] });
        },
        onError: (error) => console.log(error),
    });

    const handlePhotoChange = (file: File) => {
        setPhotoFile(file);
    };

    const validationSchema = yup.object({
        recipient: yup
            .string()
            .min(3, "Username should be of minimum 3 characters length.")
            .max(20, "Username should be of maximum 20 characters length.")
            .matches(/^[a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/, "Username is invalid")
            .required("Username is required.")
            .test("checkUserExists", "User does not exist.", async (value) => {
                if (value) {
                    const response = await checkUserExists(value);
                    if (response.success) return true;
                }
                return false;
            }),
        text: yup
            .string()
            .max(280, "Message text should be of maximum 280 characters length.")
            .required("Message text can't be empty."),
    });

    const formik = useFormik({
        initialValues: {
            sender: token.username,
            recipient: recipient,
            text: "",
            photoUrl: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (photoFile) {
                const path: string | void = await uploadFile(photoFile);
                if (!path) throw new Error("Error uploading image.");
                values.photoUrl = path;
                setPhotoFile(null);
            }
            mutation.mutate(JSON.stringify(values));
            handleNewMessageClose();
            resetForm();
            setShowDropzone(false);
        },
    });

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "block" : "hidden"}`}>
            <div 
                className="fixed inset-0 bg-gray-900/50"
                onClick={handleNewMessageClose}
            />
            <div className="relative bg-[var(--background-primary)] border border-[var(--border-color)] rounded-lg w-full max-w-sm p-4 shadow-lg">
                <h2 className="text-lg font-semibold text-[var(--active-mode)] mb-4">
                    New Message {recipient ? "to " + recipient.toLowerCase() : ""}
                </h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--active-mode)]">@</span>
                                <input
                                    name="recipient"
                                    placeholder="username"
                                    value={formik.values.recipient}
                                    onChange={formik.handleChange}
                                    disabled={!!recipient}
                                    className={`w-full pl-8 pr-3 py-2 border ${formik.errors.recipient ? "border-[var(--red)]" : "border-[var(--border-color)]"} rounded-md bg-[var(--background-primary)] text-[var(--active-mode)] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] disabled:bg-[var(--grey)] disabled:cursor-not-allowed`}
                                    autoFocus={!recipient}
                                />
                            </div>
                            {formik.errors.recipient && (
                                <p className="mt-1 text-sm text-[var(--red)]">{formik.errors.recipient}</p>
                            )}
                        </div>
                        <div>
                            <textarea
                                placeholder="Message"
                                name="text"
                                value={formik.values.text}
                                onChange={formik.handleChange}
                                className={`w-full px-3 py-2 border ${formik.touched.text && formik.errors.text ? "border-[var(--red)]" : "border-[var(--border-color)]"} rounded-md bg-[var(--background-primary)] text-[var(--active-mode)] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] min-h-[100px]`}
                                autoFocus={!!recipient}
                            />
                            {formik.touched.text && formik.errors.text && (
                                <p className="mt-1 text-sm text-[var(--red)]">{formik.errors.text}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowDropzone(true)}
                                className="p-2 border border-[var(--border-color)] rounded-full text-[var(--active-mode)] hover:bg-[var(--hover)] transition-colors"
                            >
                                <FaRegImage className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPicker(!showPicker)}
                                className="p-2 border border-[var(--border-color)] rounded-full text-[var(--active-mode)] hover:bg-[var(--hover)] transition-colors"
                            >
                                <FaRegSmile className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    {showPicker && (
                        <div className="emoji-picker">
                            <Picker
                                data={data}
                                onEmojiSelect={(emoji: LocalEmoji) => {
                                    formik.setFieldValue("text", formik.values.text + emoji.native);
                                    setShowPicker(false);
                                }}
                                previewPosition="none"
                            />
                        </div>
                    )}
                    {showDropzone && <Uploader handlePhotoChange={handlePhotoChange} />}
                    {formik.isSubmitting ? (
                        <CircularLoading />
                    ) : (
                        <button
                            type="submit"
                            disabled={!formik.isValid}
                            className="w-full py-2 px-4 bg-[var(--blue)] text-white rounded-full hover:bg-[var(--hover-blue)] transition-colors disabled:bg-[var(--grey)] disabled:text-gray-500 disabled:cursor-not-allowed font-medium"
                        >
                            Send
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}