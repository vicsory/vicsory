import { useContext, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { PostProps } from "@/types/PostProps";
import User from "../user/User";
import { AuthContext } from "@/app/(vicsory)/layout";
import { scrollToBottom } from "@/utilities/fetch/misc/scrollToBottom";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import { UserProps } from "@/types/UserProps";

export default function Counters({ post }: { post: PostProps }) {
    const [dialogType, setDialogType] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const { token } = useContext(AuthContext);

    const handleDialogOpen = (type: string) => {
        if (!token) {
            return setSnackbar({
                message: "You need to log in to view likes or reposts.",
                severity: "info",
                open: true,
            });
        }

        setDialogType(type);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogType("");
        setIsDialogOpen(false);
    };

    return (
        <>
            {post.likedBy.length === 0 && post.repostedBy.length === 0 ? null : (
                <div className="mt-2 border-t border-gray-200 pt-2">
                    <div className="flex gap-4">
                        {post.replies.length > 0 && (
                            <button 
                                className="text-gray-600 hover:text-blue-500 transition-colors duration-200" 
                                onClick={scrollToBottom}
                            >
                                <span className="font-medium">
                                    {post.replies.length} <span className="text-gray-400 font-normal">Replies</span>
                                </span>
                            </button>
                        )}
                        {post.repostedBy.length > 0 && (
                            <button 
                                className="text-gray-600 hover:text-green-500 transition-colors duration-200" 
                                onClick={() => handleDialogOpen("reposts")}
                            >
                                <span className="font-medium">
                                    {post.repostedBy.length} <span className="text-gray-400 font-normal">Reposts</span>
                                </span>
                            </button>
                        )}
                        {post.likedBy.length > 0 && (
                            <button 
                                className="text-gray-600 hover:text-red-500 transition-colors duration-200" 
                                onClick={() => handleDialogOpen("likes")}
                            >
                                <span className="font-medium">
                                    {post.likedBy.length} <span className="text-gray-400 font-normal">Likes</span>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
            {isDialogOpen && (
                <Dialog 
                    className="rounded-lg" 
                    open={isDialogOpen} 
                    onClose={handleDialogClose} 
                    fullWidth 
                    maxWidth="xs"
                >
                    <DialogTitle className="border-b border-gray-200 px-6 py-4 text-lg font-semibold text-gray-800">
                        {dialogType === "likes" ? "Liked by" : dialogType === "reposts" ? "Reposted by" : ""}
                    </DialogTitle>
                    <DialogContent sx={{ paddingX: 0 }}>
                        <div className="divide-y divide-gray-200">
                            {dialogType === "likes"
                                ? post.likedBy.map((user: UserProps) => (
                                      <div className="py-2" key={"like-" + user.id}>
                                          <User user={user} />
                                      </div>
                                  ))
                                : post.repostedBy.map((user: UserProps) => (
                                      <div className="py-2" key={"repost-" + user.id}>
                                          <User user={user} />
                                      </div>
                                  ))}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {snackbar.open && (
                <CustomSnackbar 
                    message={snackbar.message} 
                    severity={snackbar.severity} 
                    setSnackbar={setSnackbar} 
                />
            )}
        </>
    );
}