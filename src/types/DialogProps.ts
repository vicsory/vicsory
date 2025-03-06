import { UserProps } from "./UserProps";

export type LogInDialogProps = {
    open: boolean;
    handleLogInClose: () => void;
};

export type SignUpDialogProps = {
    open: boolean;
    handleSignUpClose: () => void;
};

export type NewPostDialogProps = {
    open: boolean;
    handleNewPostClose: () => void;
    token: UserProps;
};

export type LogOutDialogProps = {
    open: boolean;
    handleLogOutClose: () => void;
    logout: () => void;
    isLoggingOut: boolean;
};

export type PreviewDialogProps = {
    open: boolean;
    handlePreviewClose: () => void;
    url: string;
};

export type NewMessageDialogProps = {
    open: boolean;
    handleNewMessageClose: () => void;
    token: UserProps;
    recipient?: string;
};
