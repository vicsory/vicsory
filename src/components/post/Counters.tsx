import { useContext, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { PostProps } from "@/types/PostProps";
import User from "../user/User";
import { scrollToBottom } from "@/utilities/misc/scrollToBottom";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import { UserProps } from "@/types/UserProps";
import { AuthContext } from "@/contexts/auth-context";

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
                <div className="post-stats">
                    <div className="counters">
                        {post.replies.length > 0 && (
                            <button className="counter-btn" onClick={scrollToBottom}>
                                <span className="count">
                                    {post.replies.length} <span className="text-[var(--text-secondary)]">Replies</span>
                                </span>
                            </button>
                        )}
                        {post.repostedBy.length > 0 && (
                            <button className="counter-btn" onClick={() => handleDialogOpen("reposts")}>
                                <span className="count">
                                    {post.repostedBy.length} <span className="text-[var(--text-secondary)]">Reposts</span>
                                </span>
                            </button>
                        )}
                        {post.likedBy.length > 0 && (
                            <button className="counter-btn" onClick={() => handleDialogOpen("likes")}>
                                <span className="count">
                                    {post.likedBy.length} <span className="text-[var(--text-secondary)]">Likes</span>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
            {isDialogOpen && (
                <Dialog className="dialog" open={isDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="xs">
                    <DialogTitle className="title">
                        {dialogType === "likes" ? "Liked by" : dialogType === "reposts" ? "Reposted by" : ""}
                    </DialogTitle>
                    <DialogContent sx={{ paddingX: 0 }}>
                        <div className="user-list">
                            {dialogType === "likes"
                                ? post.likedBy.map((user: UserProps) => (
                                      <div className="user-wrapper" key={"like-" + user.id}>
                                          <User user={user} />
                                      </div>
                                  ))
                                : post.repostedBy.map((user: UserProps) => (
                                      <div className="user-wrapper" key={"repost-" + user.id}>
                                          <User user={user} />
                                      </div>
                                  ))}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
        </>
    );
}
