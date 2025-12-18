import { useState } from "react";
import { TextField, Avatar } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegImage, FaRegSmile } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Link from "next/link";

import CircularLoading from "../misc/CircularLoading";
import { createReply } from "@/utilities/fetch";
import Uploader from "../misc/Uploader";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { uploadFile } from "@/utilities/storage";
import { UserProps } from "@/types/UserProps";
import { PostProps } from "@/types/PostProps";
import ProgressCircle from "../misc/ProgressCircle";

export default function NewReply({ token, post }: { token: UserProps; post: PostProps }) {
    const [showPicker, setShowPicker] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [count, setCount] = useState(0);

    const queryClient = useQueryClient();

    const queryKey = ["posts", post.author.username, post.id];

    const mutation = useMutation({
        mutationFn: (reply: string) => createReply(reply, post.author.username, post.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (error) => console.log(error),
    });

    const handlePhotoChange = (file: File) => {
        setPhotoFile(file);
    };

    const validationSchema = yup.object({
        text: yup
            .string()
            .max(280, "Reply text should be of maximum 280 characters length.")
            .required("Reply text can't be empty."),
    });

    const formik = useFormik({
        initialValues: {
            text: "",
            authorId: token.id,
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
            resetForm();
            setShowDropzone(false);
        },
    });

    const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCount(e.target.value.length);
        formik.handleChange(e);
    };

    if (formik.isSubmitting) {
        return <CircularLoading />;
    }

    return (
        <div className="new-post-form new-reply">
            <Avatar
                className="avatar div-link"
                sx={{ width: 50, height: 50 }}
                alt=""
                src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
            />
            <form onSubmit={formik.handleSubmit}>
                <div className="input">
                    <TextField
                        placeholder="Post your reply"
                        multiline
                        minRows={1}
                        variant="standard"
                        fullWidth
                        name="text"
                        value={formik.values.text}
                        onChange={customHandleChange}
                        error={formik.touched.text && Boolean(formik.errors.text)}
                        helperText={formik.touched.text && formik.errors.text}
                        hiddenLabel
                    />
                </div>
                <div className="input-additions">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowDropzone(true);
                        }}
                        className="icon-hoverable"
                    >
                        <FaRegImage />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPicker(!showPicker);
                        }}
                        className="icon-hoverable"
                    >
                        <FaRegSmile />
                    </button>
                    <ProgressCircle maxChars={280} count={count} />
                    <button className={`btn ${formik.isValid ? "" : "disabled"}`} disabled={!formik.isValid} type="submit">
                        Reply
                    </button>
                </div>
                {showPicker && (
                    <div className="emoji-picker">
                        <Picker
                            data={data}
                            onEmojiSelect={(emoji: any) => {
                                formik.setFieldValue("text", formik.values.text + emoji.native);
                                setShowPicker(false);
                            }}
                            previewPosition="none"
                        />
                    </div>
                )}
                {showDropzone && <Uploader handlePhotoChange={handlePhotoChange} />}
                {
                    <Link className="reply-to" href={`/${post.author.username}`}>
                        Replying to <span className="mention">@{post.author.username}</span>
                    </Link>
                }
            </form>
        </div>
    );
}
