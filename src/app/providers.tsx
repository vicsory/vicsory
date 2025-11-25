"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalLoading from "@/components/misc/GlobalLoading";

const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const ThemeContext = createContext({ 
    theme: "light", 
    setTheme: (theme: "light" | "dark" | "gold") => {} 
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark" | "gold" | "loading">("loading");

    const updateTheme = (newTheme: "light" | "dark" | "gold") => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "gold") {
            setTheme(storedTheme);
        } else {
            setTheme("light");
        }
    }, []);

    useEffect(() => {
        if (theme !== "loading") {
            console.log("Setting data-theme to:", theme); // Debug log
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [theme]);

    const muiTheme = useMemo(
        () => createTheme({
            palette: {
                mode: theme === "light" ? "light" : "dark",
                primary: { main: theme === "gold" ? "#d9a75c" : "#1E90FE" },
            },
        }),
        [theme]
    );

    if (theme === "loading") return <GlobalLoading />;

    return (
        <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
            <ThemeProvider theme={muiTheme}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}