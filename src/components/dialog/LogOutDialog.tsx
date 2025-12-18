import Image from "next/image";

import { LogOutDialogProps } from "@/types/DialogProps";
import CircularLoading from "../misc/CircularLoading";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "../ui/dialog";

export default function LogOutDialog({
    open,
    handleLogOutClose,
    logout,
    isLoggingOut,
}: LogOutDialogProps) {
    return (
        <Dialog open={open} onOpenChange={handleLogOutClose}>
            <DialogContent className="w-full max-w-sm rounded-2xl p-6 bg-[var(--background-primary)]">
                <div className="flex flex-col items-center text-center gap-4">
                    <Image
                        src="/assets/favicon.png"
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                    />

                    <DialogTitle className="p-0 text-xl font-semibold text-[var(--text)]">
                        {isLoggingOut ? "Logging out..." : "Log out of Vicsory?"}
                    </DialogTitle>

                    <p className="text-base text-[var(--text)]">
                        You can always log back in at any time.
                    </p>

                    {isLoggingOut ? (
                        <div className="mt-4">
                            <CircularLoading />
                        </div>
                    ) : (
                        <div className="mt-6 flex w-full flex-col gap-3">
                            <Button
                                onClick={logout}
                                autoFocus
                                className="w-full rounded-full border border-solid border-[var(--border)] bg-[var(--background-secondary)] px-4 py-2.5 text-base font-semibold text-[var(--text)] hover:bg-[var(--background-primary)] transition"
                            >
                                Log out
                            </Button>
                            <Button
                                onClick={handleLogOutClose}
                                className="w-full rounded-full border border-solid border-[var(--border)] bg-[var(--background-secondary)] px-4 py-2.5 text-base font-semibold text-[var(--red)] hover:bg-[var(--background-primary)] transition"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
