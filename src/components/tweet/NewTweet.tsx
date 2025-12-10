"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegImage, FaRegSmile } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import CircularLoading from "../misc/CircularLoading";
import { createTweet } from "@/utilities/fetch";
import { NewTweetProps } from "@/types/TweetProps";
import Uploader from "../misc/Uploader";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { uploadFile } from "@/utilities/storage";
import ProgressCircle from "../misc/ProgressCircle";

export default function NewTweet({ token, handleSubmit }: NewTweetProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [count, setCount] = useState(0);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTweet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tweets"] }),
    onError: (error) => console.log(error),
  });

  const handlePhotoChange = (file: File) => setPhotoFile(file);

  const validationSchema = yup.object({
    text: yup.string().max(280, "Maximum 280 characters.").required("Tweet cannot be empty."),
  });

  const formik = useFormik({
    initialValues: { text: "", authorId: token.id, photoUrl: "" },
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

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCount(e.target.value.length);
    formik.handleChange(e);
  };

  if (formik.isSubmitting) return <CircularLoading />;

  return (
    <div className="flex gap-4 p-4 px-4 bg-[var(--background)] border-y border-solid border-[var(--border)] rounded-2xl">
      {/* Avatar */}
      <img
        src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
        alt="avatar"
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Form */}
      <form className="flex-1 flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <textarea
          name="text"
          placeholder="What's happening?"
          value={formik.values.text}
          onChange={customHandleChange}
          className="w-full bg-transparent resize-none outline-none text-[15px] placeholder:text-[var(--text-secondary)] text-[var(--text)] "
          rows={3}
        />
        {formik.touched.text && formik.errors.text && (
          <p className="text-xs text-red-500">{formik.errors.text}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowDropzone(true)}
              className="p-2 rounded-full hover:bg-[var(--background-hover)]"
            >
              <FaRegImage className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="p-2 rounded-full hover:bg-[var(--background-hover)]"
            >
              <FaRegSmile className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            <ProgressCircle count={count} maxChars={280} />
          </div>

          <button
            type="submit"
            disabled={!formik.isValid}
            className={`px-4 py-1 rounded-full ${
              formik.isValid
                ? "text-[var(--text)] bg-[var(--background-secondary)] hover:bg-[var(--background)] border border-solid border-[var(--border)] transition"
                : "text-[var(--text-secondary)] bg-[var(--background-secondary)] cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </div>

        {/* Emoji Picker */}
        {showPicker && (
          <div className="mt-2">
            <Picker
              data={data}
              onEmojiSelect={(emoji: any) => {
                formik.setFieldValue("text", formik.values.text + emoji.native);
                setShowPicker(false);
                setCount(count + emoji.native.length);
              }}
              previewPosition="none"
            />
          </div>
        )}

        {/* Photo Uploader */}
        {showDropzone && <Uploader handlePhotoChange={handlePhotoChange} />}
      </form>
    </div>
  );
}
