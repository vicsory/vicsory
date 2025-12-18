import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";

import { NewPostDialogProps } from "@/types/DialogProps";
import NewPost from "../post/NewPost";

export default function NewPostDialog({ open, handleNewPostClose, token }: NewPostDialogProps) {
    const [isSubmitted, setIsSubmited] = useState(false);

    const handleSubmit = () => {
        setIsSubmited(!isSubmitted);
    };

    useEffect(() => {
        handleNewPostClose();
    }, [isSubmitted]);

    return (
        <Dialog className="dialog" open={open} onClose={handleNewPostClose} maxWidth={"xs"} fullWidth>
            <div className="new-post-wrapper">
                <NewPost token={token} handleSubmit={handleSubmit} />
            </div>
        </Dialog>
    );
}
