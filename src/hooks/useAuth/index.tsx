"use client";

import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { verifyJwtToken } from "@/utilities/auth";
import { VerifiedToken } from "@/types/TokenProps";

export default function useAuth() {
    const [token, setToken] = useState<VerifiedToken | null>(null);
    const [isPending, setIsPending] = useState<boolean>(true);

    const getVerifiedToken = async () => {
        setIsPending(true);
        const cookies = new Cookies();
        const token = cookies.get("token") ?? null;
        const verifiedToken = token && (await verifyJwtToken(token));
        setToken(verifiedToken);
        setIsPending(false);
    };

    const refreshToken = async () => {
        const cookies = new Cookies();
        const token = cookies.get("token") ?? null;
        const verifiedToken = token && (await verifyJwtToken(token));
        setToken(verifiedToken);
    };

    useEffect(() => {
        getVerifiedToken();
    }, []);

    return { token, isPending, refreshToken };
}